import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../burger-constructor-slice';
import { TIngredient } from '@utils-types';

jest.mock('@reduxjs/toolkit', () => {
  const actual = jest.requireActual('@reduxjs/toolkit');
  let counter = 0;
  return {
    ...actual,
    nanoid: () => `test-id-${counter++}`
  };
});

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: '',
  image_large: '',
  image_mobile: ''
};

const main: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлетка из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: '',
  image_large: '',
  image_mobile: ''
};

const sauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('редьюсер burger-constructor-slice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = burgerConstructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  test('addIngredient: булка кладётся в поле bun, а не в массив ingredients', () => {
    const state = burgerConstructorReducer(initialState, addIngredient(bun));
    expect(state.bun?._id).toBe(bun._id);
    expect(state.ingredients).toHaveLength(0);
  });

  test('addIngredient: начинка/соус добавляется в массив ingredients', () => {
    const state = burgerConstructorReducer(initialState, addIngredient(main));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(main._id);
  });

  test('addIngredient: повторное добавление булки заменяет предыдущую', () => {
    const stateAfterFirst = burgerConstructorReducer(
      initialState,
      addIngredient(bun)
    );
    const anotherBun: TIngredient = {
      ...bun,
      _id: 'bun-2',
      name: 'Другая булка'
    };
    const stateAfterSecond = burgerConstructorReducer(
      stateAfterFirst,
      addIngredient(anotherBun)
    );
    expect(stateAfterSecond.bun?._id).toBe('bun-2');
  });

  test('removeIngredient: удаляет ингредиент по id', () => {
    const stateWithIngredient = burgerConstructorReducer(
      initialState,
      addIngredient(main)
    );
    const addedId = stateWithIngredient.ingredients[0].id;

    const state = burgerConstructorReducer(
      stateWithIngredient,
      removeIngredient(addedId)
    );
    expect(state.ingredients).toHaveLength(0);
  });

  test('moveIngredientUp: меняет местами ингредиент с предыдущим', () => {
    let state = burgerConstructorReducer(initialState, addIngredient(main));
    state = burgerConstructorReducer(state, addIngredient(sauce));

    const [first, second] = state.ingredients;
    const nextState = burgerConstructorReducer(state, moveIngredientUp(1));

    expect(nextState.ingredients[0]).toEqual(second);
    expect(nextState.ingredients[1]).toEqual(first);
  });

  test('moveIngredientDown: меняет местами ингредиент со следующим', () => {
    let state = burgerConstructorReducer(initialState, addIngredient(main));
    state = burgerConstructorReducer(state, addIngredient(sauce));

    const [first, second] = state.ingredients;
    const nextState = burgerConstructorReducer(state, moveIngredientDown(0));

    expect(nextState.ingredients[0]).toEqual(second);
    expect(nextState.ingredients[1]).toEqual(first);
  });

  test('clearConstructor: очищает булку и список ингредиентов', () => {
    let state = burgerConstructorReducer(initialState, addIngredient(bun));
    state = burgerConstructorReducer(state, addIngredient(main));

    const clearedState = burgerConstructorReducer(state, clearConstructor());
    expect(clearedState).toEqual(initialState);
  });
});
