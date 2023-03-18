import {Exam} from "../models/Exam";
import {TestQuestion} from "../models/testQuestion";

export const examJSONtoModel = (examJSON: string): Exam => {
    const exam = JSON.parse(examJSON);
    const questions = exam.questions.map((question: any) => {
        switch (question.type) {
            case "test":
                return new TestQuestion(question.id, question.question, question.options, question.answer, question.type);
            default:
                return null;
        }
    }   );

    return new Exam(exam.name, exam.description, questions, exam.asignatureID,new Date(exam.startDate), new Date(exam.endDate));
}

