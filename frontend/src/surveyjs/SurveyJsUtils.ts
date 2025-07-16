export const allQuestionNames= (surveyJson) => {
    let all:string[] = [];
    surveyJson.pages?.map((page, pageIndex) => (
        page.elements?.map((q, qIndex) => (
            all.push(q?.name)))));
    return all;
}
