import { ActivityIndicator, Button, FlatList, ImageBackground, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { getStarWarsCharacters } from '@/src/Api/GetStarWarsCharacters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 10
const QUERY_URL = "https://swapi.dev/api/people"
const SERACH_PARAM_BASE = "&search="
const PAGE_PARAM_BASE = "?page="


export const getAllCharacterList = async () => {
  let hasNextPage = true
  let url = QUERY_URL
  let characterList: any[] = []

  do {
    const response = await fetch(url)
    const result = (await response.json())

    characterList = [...characterList, ...result.results]

    if (result.next !== null) {
      url = result.next
    } else {
      hasNextPage = false
    }
  } while (hasNextPage);

  return characterList
}

export default function MainScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [allCharacters, setAllCharacters] = useState<any[]>([])
  const [characterList, setCharacterList] = useState<any[]>([])
  const [searchInput, setSerachInput] = useState("")
  const [page, setPage] = useState(0)
  const [selectedPageSize, setSelectedPageSize] = useState(25)
  const [isPagedModeTurnedOn, setIsPagedModeTurnedOn] = useState(false)

  useEffect(() => {
    loadAllCharacter()
  }, [])

  const loadAllCharacter = async () => {
    setIsLoading(true)
    const newList = await getAllCharacterList()
    setAllCharacters(newList)
    setCharacterList(newList)
    setIsLoading(false)
  }

  useEffect(() => {
    if (searchInput.length === 0) {
      setCharacterList(allCharacters)
      return
    }
    setCharacterList(allCharacters.filter(item => (item.name as string).toLowerCase().includes(searchInput.toLowerCase())))
  }, [searchInput])


  const sortList = () => {
    setSerachInput("")
    const blueEyedCharacterList = allCharacters.filter(item => item.eye_color === "blue").sort(function (a, b) {
      const x = a["name"]
      const y = b["name"]
      return (x > y) - (y > x);
    })

    const creationSortedCharacterList = allCharacters.filter(item => item.eye_color !== "blue").sort(function (a, b) {
      const x = new Date(a["created"]).getTime()
      const y = new Date(b["created"]).getTime()
      return (x > y) - (y > x);
    })

    setCharacterList([...blueEyedCharacterList, ...creationSortedCharacterList])
  }

  useEffect(() => {
    if (isPagedModeTurnedOn) {
      setPage(0)
      setCharacterList(allCharacters.slice(page * selectedPageSize, (page * selectedPageSize) + selectedPageSize))
    }
  }, [isPagedModeTurnedOn])

  const changePageSize = (size: number) => {
    setSelectedPageSize(size)
    setCharacterList(allCharacters.slice(page * size, (page * size) + size))
  }

  const loadPrevPage = () => {
    setPageAndChangeList(page - 1)

  }

  const loadNextPage = () => {
    setPageAndChangeList(page + 1)
  }

  const setPageAndChangeList = (page: number) => {
    setPage(page)
    const newList = allCharacters.slice(page * selectedPageSize, (page * selectedPageSize) + selectedPageSize)
    if (newList.length > 0) {
      setCharacterList(newList)
    }
  }

  const render = () => {
    return (
      <ImageBackground style={styles.background} source={require("../assets/images/starwars.jpg")}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>STAR WARS</Text>
          <TextInput
            testID="input"
            style={styles.input}
            value={searchInput}
            onChangeText={setSerachInput}
            selectionColor={"white"}
          />
          <View style={styles.baseArea}>
            <Button title='Character List Sorting' onPress={sortList} />
            <Button title='Table and Pagination' onPress={() => setIsPagedModeTurnedOn(s => !s)} />
          </View>
          {isPagedModeTurnedOn && <View style={styles.baseArea}>
            {renderPageButton(25)}
            {renderPageButton(50)}
            {renderPageButton(75)}
            {renderPageButton(100)}
          </View>}
          {renderContent()}
        </SafeAreaView>
      </ImageBackground>
    );
  }

  const renderPageButton = (size: number) => <Button title={size.toString()} color={selectedPageSize === size ? dark_blue : undefined} onPress={() => changePageSize(size)} />

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
          ListFooterComponent={renderListFooter}
        />
      </>
    );
  }

  const renderListFooter = () => isPagedModeTurnedOn ? <>
    <View style={styles.spacing} />
    <View style={styles.baseArea}>
      {page > 0 ? <Button title='prev page' onPress={loadPrevPage} /> : <View />}
      <Button title='next page' onPress={loadNextPage} />
    </View>
    <View style={styles.spacing} />
  </> : <View style={styles.spacing} />

  const renderItem = (data: { item: any, index: number }) => {
    return <View style={styles.itemArea}>
      <Text testID={`list-item-${data.index}`} style={{ color: "black" }}>{data.item.name}</Text>
    </View>
  }

  return render()
}

const dark_blue = "rgb(0,0,139)"

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
  title: {
    fontSize: 20,
    color: "white",
    alignSelf: "center",
    paddingBottom: 20,
  },
  baseArea: {

    flexDirection: "row",
    width: "100%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "transparent"
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
