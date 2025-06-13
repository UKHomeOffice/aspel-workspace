import React from 'react';
import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { expect } from '@jest/globals';
import WordCountHintMessage from './wordcount-hint-message';

describe('<WordCountHintMessage />', () => {
  const store = configureStore({
    reducer: {
      dummy: (state = {}) => state  // no-op reducer
    }
  });

  const id = 'applicantTrainingUseAtWork';
  const wordCountHintId = `${id}-wordcount-hint`;

  test('displays max words remaining when wordCount is not provided', () => {
    render(
      <Provider store={store}>
      <WordCountHintMessage content='' maxWordCount={10} id={id} />
    </Provider>
    );
    expect(screen.getByTestId(wordCountHintId)).toHaveTextContent('You have 10 words remaining');
  });

  test('displays remaining words when wordCount is less than maxWordCount', () => {
    render(
      <Provider store={store}>
        <WordCountHintMessage content='This is a sentence with 7 words' maxWordCount={10} id={id} />
      </Provider>
    );
    expect(screen.getByTestId(wordCountHintId)).toHaveTextContent('You have 3 words remaining');
  });

  test('displays no remaining words when wordCount is equal to maxWordCount', () => {
    render(
      <Provider store={store}>
        <WordCountHintMessage content='This is a sentence with 10 words - 2 more' maxWordCount={10} id={id} />
      </Provider>
    );
    expect(screen.getByTestId(wordCountHintId)).toHaveTextContent('You have 0 words remaining');
  });

  test('displays too many words when wordCount is greater than maxWordCount', () => {
    render(<Provider store={store}>
      <WordCountHintMessage content='This is a sentence with 12 words - 2 more plus 2' maxWordCount={10} id={id} />
    </Provider>
    );
    expect(screen.getByTestId(wordCountHintId)).toHaveTextContent('You have 2 words too many');
  });

  test('displays singular word when there is only one word remaining', () => {
    render(<Provider store={store}>
      <WordCountHintMessage content='This is a sentence with 9 words i think' maxWordCount={10} id={id} />
    </Provider>
    );
    expect(screen.getByTestId(wordCountHintId)).toHaveTextContent('You have 1 word remaining');
  });

  test('displays singular word when there is only one word too many', () => {
    render(<Provider store={store}>
      <WordCountHintMessage content='This is a sentence with 11 words - 3 more words' maxWordCount={10} id={id} />
    </Provider>
    );
    expect(screen.getByTestId(wordCountHintId)).toHaveTextContent('You have 1 word too many');
  });
});
