import { ActivityIndicator, Button, FlatList, ImageBackground, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { getStarWarsCharacters } from '@/src/Api/GetStarWarsCharacters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 10
const QUERY_URL = "https://swapi.dev/api/people"
const SERACH_PARAM_BASE = "&search="
const PAGE_PARAM_BASE = "?page="


export const getCharacterList = async (page: number, searchParam?: string) => {
  const response = await fetch(`${QUERY_URL}${PAGE_PARAM_BASE + page}${searchParam ? SERACH_PARAM_BASE + searchParam : ""}`)

  const characterList = (await response.json()).results


  return characterList
}

export default function MainScreen() {

  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isListEndLoading, setIsListEndLoading] = useState(false)
  const [characterList, setCharacterList] = useState<any[]>([])
  const [searchInput, setSerachInput] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const newList = await getCharacterList(1, searchInput)
    setCharacterList(newList)
    setIsLoading(false)
  }

  const refreshList = async () => {
    await loadData()
  }

  const loadNextPage = async () => {
    if (searchInput.length > 0) {
      return
    }
    setIsListEndLoading(true)
    setPage(page + 1)
    const newList = await getCharacterList(page)
    setCharacterList((s) => [...s, ...newList])
    setIsListEndLoading(false)
  }

  const render = () => {
    return (
      <ImageBackground style={styles.background} source={require("../assets/images/starwars.jpg")}>
        <SafeAreaView style={styles.container}>
          <TextInput
            testID="input"
            style={styles.input}
            value={searchInput}
            onChangeText={setSerachInput}
            onBlur={refreshList}
            selectionColor={"white"}
          />
          {renderContent()}
        </SafeAreaView>
      </ImageBackground>
    );
  }

  const renderContent = () => {

    if (isLoading) {
      return <><View style={styles.spacing} />
        <ActivityIndicator style={{ flex: 1 }} size={"large"} color={"white"} />
        <View style={styles.spacing} />
      </>
    }


    return (
      <>
        <FlatList
          contentContainerStyle={styles.list}
          style={styles.fullWidth}
          data={characterList}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.spacing} />}
          onEndReached={loadNextPage}
          ListFooterComponent={renderListFooter}
        />
      </>
    );
  }

  const renderListFooter = () => isListEndLoading ?
    <>
      <View style={styles.spacing} />
      <ActivityIndicator size={"large"} color={"white"} />
      <View style={styles.spacing} />
    </>
    : <View style={styles.spacing} />

  const renderItem = (data: { item: any, index: number }) => {
    return <View style={styles.itemArea}>
      <Text testID={`list-item-${data.index}`} style={{ color: "black" }}>{data.item.name}</Text>
    </View>
  }

  return render()
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: "rgba(0,0,0,0.7)",
    width: "100%",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: "90%",
    alignSelf: "center",
    height: 50,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.4)",
    fontSize: 20,
    color: "white",
    paddingHorizontal: 10,
  },
  list: {
    flexGrow: 1,
    paddingTop: 20,
    backgroundColor: "transparent",
    width: "100%"
  },
  itemArea: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 40,
    borderRadius: 15,
    backgroundColor: "white"
  },
  infoText: {
    flex: 1,
    padding: 30
  },
  spacing: {
    width: 20,
    height: 20,
    backgroundColor: "transparent"
  },
  row: {
    flexDirection: "row",
    backgroundColor: "transparent"
  },
  fullWidth: {
    width: "100%"
  }
});
