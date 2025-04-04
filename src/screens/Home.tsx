import { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";

import AntDesign from "@expo/vector-icons/AntDesign";

import Logo from "../assets/Logo.png";

interface ShopItem {
  id: string;
  name: string;
  quantity: number;
  isChecked: boolean;
}

export function Home() {
  const [count, setCount] = useState<number>(1);
  const [itemName, setItemName] = useState<string>("");
  const [items, setItems] = useState<ShopItem[]>([]);
  const [filter, setFilter] = useState<"pendentes" | "comprados">("pendentes");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const savedItems = await AsyncStorage.getItem("@shoplist:items");
      if (savedItems !== null) {
        setItems(JSON.parse(savedItems));
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a lista de compras.");
    }
  };

  const saveItems = async (newItems: ShopItem[]) => {
    try {
      await AsyncStorage.setItem("@shoplist:items", JSON.stringify(newItems));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a lista de compras.");
    }
  };

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => (prev > 1 ? prev - 1 : 1));

  const addItem = () => {
    if (!itemName.trim()) {
      Alert.alert("Atenção", "Digite o nome do item que deseja adicionar.");
      return;
    }

    const newItem: ShopItem = {
      id: Date.now().toString(),
      name: itemName.trim().toUpperCase(),
      quantity: count,
      isChecked: false,
    };

    const newItems = [...items, newItem];
    setItems(newItems);
    saveItems(newItems);

    setItemName("");
    setCount(1);
  };

  const toggleItemCheck = (id: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setItems(updatedItems);
    saveItems(updatedItems);
  };

  const removeItem = (id: string) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja remover este item?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          onPress: () => {
            const newItems = items.filter((item) => item.id !== id);
            setItems(newItems);
            saveItems(newItems);
          },
          style: "destructive",
        },
      ]
    );
  };

  const clearList = () => {
    Alert.alert("Confirmar", "Deseja limpar toda a lista?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Limpar",
        onPress: () => {
          setItems([]);
          saveItems([]);
        },
        style: "destructive",
      },
    ]);
  };

  const filteredItems = items.filter((item) =>
    filter === "pendentes" ? !item.isChecked : item.isChecked
  );

  const renderItem = ({ item }: { item: ShopItem }) => (
    <View className="flex-row w-full h-20 bg-white border-2 border-gray-100 rounded-xl px-5 mb-3 items-center">
      <Checkbox
        value={item.isChecked}
        onValueChange={() => toggleItemCheck(item.id)}
        className="rounded-full"
        style={{ borderRadius: 12, height: 20, width: 20 }}
      />
      <Text className="pl-2 text-xl text-zinc-500 font-inter-black">
        {item.quantity}
      </Text>
      <Text
        className={`pl-2 text-sm ${
          item.isChecked
            ? "text-gray-400 line-through font-inter-black"
            : "text-zinc-500 font-inter-black"
        }`}
      >
        {item.name}
      </Text>
      <View className="flex-1 items-end">
        <TouchableOpacity
          className="w-8 h-7"
          onPress={() => removeItem(item.id)}
        >
          <AntDesign name="delete" size={20} color="#fca5a5" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 px-8">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 mt-24">
          <View className="flex flex-row items-center justify-center mb-10 gap-2">
            <Image source={Logo} className="w-14 h-14" />
            <Text className="text-2xl text-blue-500 font-inter-black">
              SHOPLIST
            </Text>
          </View>
          <View className="flex flex-row gap-2">
            <View className="flex flex-row w-24 items-center justify-center h-16 bg-white border-2 border-gray-100 rounded-lg gap-2">
              <TouchableOpacity onPress={decrement}>
                <Text className="text-xl text-zinc-500 font-inter-black">
                  -
                </Text>
              </TouchableOpacity>
              <TextInput
                placeholder="1"
                className="text-sm text-zinc-600 font-inter-bold"
                keyboardType="number-pad"
                maxLength={2}
                value={count.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text, 10);
                  setCount(isNaN(num) ? 1 : num);
                }}
              />
              <TouchableOpacity onPress={increment}>
                <Text className="text-xl text-zinc-500 font-inter-black">
                  +
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="O que você precisa comprar?"
              className="flex-1 h-16 bg-white rounded-lg pl-3 border-2 border-gray-100 text-sm text-zinc-600 font-inter-semibold"
              placeholderTextColor="#52525b"
              autoCapitalize="characters"
              value={itemName}
              onChangeText={setItemName}
            />
          </View>
          <TouchableOpacity
            className="w-full mt-5 h-16 bg-blue-500 rounded-lg items-center justify-center"
            onPress={addItem}
          >
            <Text className="text-gray-200 text-sm font-inter-bold">
              ADICIONAR
            </Text>
          </TouchableOpacity>
          <View className="mt-10 flex flex-row gap-4 mb-3">
            <TouchableOpacity
              className="flex flex-row gap-1"
              onPress={() => setFilter("pendentes")}
            >
              <Checkbox
                value={filter === "pendentes"}
                style={{ borderRadius: 12 }}
              />
              <Text className="text-sm text-zinc-500 font-inter-bold">
                PENDENTES
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex flex-row gap-1"
              onPress={() => setFilter("comprados")}
            >
              <Checkbox
                value={filter === "comprados"}
                style={{ borderRadius: 12 }}
              />
              <Text className="text-sm text-zinc-500 font-inter-bold">
                COMPRADOS
              </Text>
            </TouchableOpacity>
            <View className="flex-1 items-end">
              <TouchableOpacity onPress={clearList}>
                <Text className="text-sm text-zinc-500 font-inter-bold">
                  LIMPAR
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center mt-10">
                <Text className="text-zinc-500 font-inter-bold">
                  Sua lista está vazia
                </Text>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
