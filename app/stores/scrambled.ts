import { defineStore } from "pinia";

export const animalsArray = [
  'Lion', 'Tiger', 'Elephant', 'Giraffe', 'Zebra', 'Kangaroo', 'Panda', 'Gorilla', 'Cheetah', 'Rhinoceros',
  'Hippopotamus', 'Crocodile', 'Alligator', 'Penguin', 'Ostrich', 'Dolphin', 'Whale', 'Shark', 'Octopus', 'Eagle',
  'Hawk', 'Falcon', 'Owl', 'Parrot', 'Peacock', 'Flamingo', 'Chimpanzee', 'Orangutan', 'Baboon', 'Lemur',
  'Koala', 'Sloth', 'Armadillo', 'Porcupine', 'Hedgehog', 'Squirrel', 'Raccoon', 'Fox', 'Wolf', 'Bear',
  'Deer', 'Moose', 'Elk', 'Buffalo', 'Bison', 'Camel', 'Llama', 'Alpaca', 'Goat', 'Sheep'
]

export const countriesArray = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
  'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Chad', 'Chile',
  'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Denmark', 'Djibouti',
  'Ecuador', 'Egypt', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia'
]

export const citiesArray = [
  'Tokyo', 'Delhi', 'Shanghai', 'Sao Paulo', 'Mexico City', 'Cairo', 'Mumbai', 'Beijing', 'Dhaka', 'Osaka',
  'New York', 'Karachi', 'Buenos Aires', 'Chongqing', 'Istanbul', 'Kolkata', 'Manila', 'Lagos', 'Rio de Janeiro', 'Tianjin',
  'Kinshasa', 'Guangzhou', 'Los Angeles', 'Moscow', 'Shenzhen', 'Lahore', 'Bangalore', 'Paris', 'Bogota', 'Jakarta',
  'Chennai', 'Lima', 'Bangkok', 'Seoul', 'Nagoya', 'Hyderabad', 'London', 'Tehran', 'Chicago', 'Chengdu',
  'Nanjing', 'Wuhan', 'Ho Chi Minh City', 'Luanda', 'Ahmedabad', 'Kuala Lumpur', 'Hong Kong', 'Dongguan', 'Foshan', 'Hangzhou'
]

export const allWords = ['action', 'advice', 'afraid', 'beautiful', 'courage', 'determination'] 

export const combinedArray = [...animalsArray, ...countriesArray, ...citiesArray, ...allWords]

export const useScrambled = defineStore('scrambled', () => {
const categories = ref<'animals' | 'countries'| 'world cities' | 'all dictionary'>('animals')
const countdownTimer = ref(15)
const gameType = ref<'solo' | 'versus'>('solo')
const difficulty = ref<'easy' | 'medium' | 'hard' | 'all'>('easy')
const selectedMode = ref('animals')
const playerOne = ref('Player 1')
const playerTwo = ref('Player 2')
const modes = ref([
  { label: 'Animals', value: 'animals' },
  { label: 'Countries', value: 'countries' },
  { label: 'World Cities', value: 'cities' },
  { label: 'All Dictionary', value: 'all' }
])

return {
    categories,
    countdownTimer,
    gameType,
    modes,
    selectedMode,
    playerOne,
    playerTwo,
    difficulty,
}
})