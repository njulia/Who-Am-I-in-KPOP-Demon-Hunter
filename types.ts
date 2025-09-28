export interface Character {
  name: string;
  description: string;
  style: string;
  colors: string;
}

export interface GenerationResult {
  imageUrl: string;
  characterName: string;
}
