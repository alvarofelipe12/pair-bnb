import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private recipes: Recipe[] = [
      {
        id: 'r1',
        title: 'Schnitzel',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Breitenlesau_Krug_Br%C3%A4u_Schnitzel.JPG/2560px-Breitenlesau_Krug_Br%C3%A4u_Schnitzel.JPG',
        ingredients: ['French Fries', 'Pork Meat', 'Salad']
      },
      {
        id: 'r2',
        title: 'Spaghetti',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Spaghettoni.jpg/1280px-Spaghettoni.jpg',
        ingredients: ['Spaghetti', 'Meat', 'Tomatoes']
      },
    ]

  constructor() { }

  getAllRecipers() {
    return [...this.recipes];
  }

  getRecipe(recipeId: string) {
    return {
      ...this.recipes.find(recipe => recipeId === recipe.id)
    };
  }

  deleteRecipe(recipeId: string) {
    this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
  }
}
