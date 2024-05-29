export interface Recipe {
    id: number;
    title: string;
    image: string;
    imageType: string;
  }
  
  export interface RecipeDetail {
    id: number;
    title: string;
    image: string;
    instructions: Instruction[];
  }
  
  export interface Instruction {
    name: string;
    steps: Step[];
  }
  
  export interface Step {
    equipment: Equipment[];
    ingredients: Ingredient[];
    number: number;
    step: string;
    length?: Length;
  }
  
  export interface Equipment {
    id: number;
    image: string;
    name: string;
    temperature?: Temperature;
  }
  
  export interface Ingredient {
    id: number;
    image: string;
    name: string;
    aisle: string;
    possibleUnits: string[];
  }
  
  export interface Temperature {
    number: number;
    unit: string;
  }
  
  export interface Length {
    number: number;
    unit: string;
  }
  
  