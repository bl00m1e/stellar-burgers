import ingredientsReducer, { fetchIngredients } from '../ingredients-slice';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
};

describe('редьюсер ingredients-slice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('fetchIngredients.pending: включает isLoading и сбрасывает error', () => {
    const stateWithError = { ...initialState, error: 'предыдущая ошибка' };
    const state = ingredientsReducer(
      stateWithError,
      fetchIngredients.pending('requestId')
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetchIngredients.fulfilled: сохраняет список и выключает isLoading', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.fulfilled([mockIngredient], 'requestId')
    );
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([mockIngredient]);
  });

  test('fetchIngredients.rejected: сохраняет текст ошибки и выключает isLoading', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      fetchIngredients.rejected(
        new Error('Ошибка сети'),
        'requestId',
        undefined
      )
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сети');
  });
});
