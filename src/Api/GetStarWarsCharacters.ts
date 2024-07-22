import { useQuery } from "@tanstack/react-query";

const QUERY_URL = "https://swapi.dev/api/people"
const SERACH_PARAM_BASE = "&search="
const PAGE_PARAM_BASE = "?page="


const getCharacters = async (page: number, searchParam?: string) => {
  const response = await fetch(`${QUERY_URL}${PAGE_PARAM_BASE + page}${searchParam ? SERACH_PARAM_BASE + searchParam : ""}`)

  const characterList = (await response.json()).results

  return characterList
}



export const getStarWarsCharacters = (page: number, searchParam?: string) => useQuery({
  queryKey: [`star_wars_chatacter_${page}_${searchParam ?? ""}`],
  queryFn: () => getCharacters(page, searchParam),
})