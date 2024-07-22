import { Button, FlatList, ImageBackground, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { getStarWarsCharacters } from '@/src/Api/GetStarWarsCharacters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 10

export default function MainScreen() {

  const [page, setPage] = useState(1)
  const [searchParam, setSearchParam] = useState("")
  const [searchInput, setSerachInput] = useState("")
  const characterList = getStarWarsCharacters(page, searchParam)

  useEffect(() => {
    if (searchInput.length === 0) {
      setSearchParam("")
    }
  }, [searchInput])

  useEffect(() => {
    characterList.refetch()
  }, [searchParam])

  const refreshList = () => {
    setPage(1)
    setSearchParam(searchInput)
  }

  const loadNextPage = () => {
    setPage(page + 1)
    characterList.refetch()
  }

  const loadPrevPage = () => {
    setPage(page - 1)
    characterList.refetch()
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

    if (characterList.error) {
      return <Text style={styles.infoText}>ERROR</Text>
    }

    if (characterList.isLoading) {
      return <Text style={styles.infoText}>LOADING</Text>
    }


    return (
      <>
        <Text testID={'list-item'} style={{ color: "black" }}>{characterList.data[0].name}</Text>

        <FlatList
          contentContainerStyle={styles.list}
          style={styles.fullWidth}
          data={characterList.data}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.spacing} />}
        />

        <View style={styles.row}>
          {page > 1 && <><Button title='PREV page'
            onPress={loadPrevPage} />
            <View style={styles.spacing} />
          </>}
          {PAGE_SIZE === characterList.data.length && <Button title='NEXT page'
            onPress={loadNextPage} />}
        </View>
      </>
    );
  }

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
