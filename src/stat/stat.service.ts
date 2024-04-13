import { Injectable } from '@nestjs/common';
import { QuestionService } from '../question/question.service';
import { AnswerService } from '../answer/answer.service';
import { Question } from '../question/schemas/question.schema';
import { SurveyEditorComponentTypes } from './stat.type';

@Injectable()
export class StatService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
  ) {}

  // 获取单选按钮的标签
  private _getRadioOptText(value: string, props: any = {}) {
    const { options = [] } = props;
    return options.find((o: any) => o.value === value).label || '';
  }
  // 获取多选框的文案
  private _getCheckboxOptText(value: string[], props: any = {}) {
    const { list = [] } = props;
    const arr = [];

    value.forEach((val) => {
      const res = list.find((o: any) => o.value === val).label || '';
      arr.push(res);
    });

    return arr.filter(Boolean).join(',');
  }
  // 获取问卷信息
  private _genAnswersInfo(question: Question, answerList = []) {
    const res = {};

    const { componentList = [] } = question;

    answerList.forEach((answer) => {
      const { componentFeId, value } = answer;
      // 获取组件信息
      const comp = componentList.filter((c) => c.fe_id === componentFeId)[0];
      const { type = '', props = {} } = comp;
      switch (type) {
        case SurveyEditorComponentTypes.radio:
          // 单选
          res[componentFeId] = this._getRadioOptText(value, props);
          break;
        case SurveyEditorComponentTypes.checkbox:
          const vals = value.split(',').filter(Boolean).length > 1 ? value.split(',') : [value];
          // 多选
          res[componentFeId] = this._getCheckboxOptText(vals, props);
          break;
        default:
          res[componentFeId] = value.toString();
      }
    });
    return res;
  }

  // 获取问卷的答案列表
  async getQuestionStatListCount(questionId: string, options: { page: number; pageSize: number }) {
    const noData = { list: [], count: 0 };
    if (!questionId) return noData;

    const question = await this.questionService.findOne(questionId);
    if (!question) return noData;

    const total = await this.answerService.count(questionId);
    if (total === 0) return noData;

    const answers = await this.answerService.findAll(questionId, options);

    return {
      list: answers.map((answer) => ({
        id: answer._id,
        ...this._genAnswersInfo(question, answer.answerList),
      })),
      total,
    };
  }

  // 获取单个组件的统计数据
  async getComponentStat(questionId: string, componentFeId: string) {
    if (!questionId || !componentFeId) return [];

    // 获取问卷
    const q = await this.questionService.findOne(questionId); // 问卷
    if (q == null) return [];

    // 获取组件
    const { componentList = [] } = q;
    const comp = componentList.find((c) => c.fe_id === componentFeId);
    if (comp == null) return [];

    const { type, props } = comp;
    if (type !== SurveyEditorComponentTypes.radio && type !== SurveyEditorComponentTypes.checkbox) {
      // 单组件的，只统计单选和多选。其他不统计
      return [];
    }

    // 获取答卷列表
    const total = await this.answerService.count(questionId);
    if (total === 0) return []; // 答卷总数量

    const answers = await this.answerService.findAll(questionId, {
      page: 1,
      pageSize: total, // 获取所有的，不分页
    });

    // 累加各个 value 数量
    const countInfo = {};
    answers.forEach((a) => {
      const { answerList = [] } = a;

      answerList.forEach((a) => {
        if (a.componentFeId !== componentFeId) return;
        a.value.split(',').forEach((v) => {
          if (countInfo[v] == null) countInfo[v] = 0;
          countInfo[v]++; // 累加
        });
      });
    });

    // 整理数据
    const list = [];
    for (const val in countInfo) {
      // 根据 val 计算 text
      let text = '';
      if (type === SurveyEditorComponentTypes.radio) {
        text = this._getRadioOptText(val, props);
      }
      if (type === SurveyEditorComponentTypes.checkbox) {
        const vals = val.split(',').filter(Boolean).length > 1 ? val.split(',') : [val];
        text = this._getCheckboxOptText(vals, props);
      }

      list.push({ name: text, value: countInfo[val] });
    }

    return list;
  }
}
