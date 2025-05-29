
import { FormQuestion } from '../../../types/forms';

export interface BaseQuestionComponentProps<T = any> {
  question: FormQuestion;
  value: T;
  onChange: (value: T) => void;
  error?: string;
}
