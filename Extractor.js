
function extractQuestions() {
  const results = [];
  // 选中所有题目容器
  const aiAreas = document.querySelectorAll('div.aiAreaContent');

  aiAreas.forEach((area, index) => {
    // ---- 提取题号与题型 ----
    const h3 = area.querySelector('h3.mark_name');
    let questionNum = '';
    let questionType = '';
    if (h3) {
      // h3 的直接文本节点包含题号，如 "1. "
      const numMatch = h3.childNodes[0]?.textContent?.match(/(\d+)\./);
      questionNum = numMatch ? numMatch[1] : String(index + 1);
      // 题型在 span.colorShallow 中
      const typeSpan = h3.querySelector('span.colorShallow');
      questionType = typeSpan ? typeSpan.textContent.trim() : '';
    }

    // ---- 提取题干 ----
    // class="qtContent workTextWrap" 为题干
    const qtContent = area.querySelector('.qtContent.workTextWrap');
    const questionText = qtContent ? qtContent.textContent.trim() : '';

    // ---- 提取选项 ----
    // ul 下的 li.workTextWrap 为各选项
    const optionLis = area.querySelectorAll('ul.mark_letter li.workTextWrap');
    const options = [];
    optionLis.forEach(li => {
      const text = li.textContent.trim();

       // ---- 提取正确答案 ----
    const rightAnswer = area.querySelector('.rightAnswerContent.workTextWrap');
    const correctAnswer = rightAnswer ? rightAnswer.textContent.trim() : '';

      // 用正则分离选项字母与内容，如 "A. 合成化学药物"
      const optMatch = text.match(/^([A-Z])\.\s*(.*)/);
      if (optMatch) {
        options.push({ label: optMatch[1], content: optMatch[2] });
      } else {
        options.push({ label: '', content: text });
      }
    });

    // 拼接选项为可读字符串
    const optionsStr = options.map(o => `${o.label}. ${o.content}`).join('\n');

    results.push({
      题号: questionNum,
      题型: questionType,
      题干: questionText,
      选项: optionsStr,
//      答案: correctAnswer
    });
  });

  return results;
}

// === 必须先执行函数，将结果保存到 questions 变量中 ===
const questions = extractQuestions();

let textOutput = '';
questions.forEach(q => {
  textOutput += `【第${q.题号}题】${q.题型}\n`;
  textOutput += `题干：${q.题干}\n`;
  if (q.选项) {
    textOutput += `选项：\n${q.选项.split('\n').map(s => '  ' + s).join('\n')}\n`;
  }
//  textOutput +=`答案:${q.答案}`
  textOutput += '\n';
});
console.log(textOutput);
