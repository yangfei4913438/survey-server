export class AnswerDto {
  readonly questionId: string;
  readonly answerList: {
    componentFeId: string; // 对应组件的 fe_id
    value: string[]; // 多选的值
  };
}
