import { Input } from "@/components/ui/input";
import React from "react";

const parseBBCode = (
  bbcode: string,
  inputs: { [key: string]: string },
  onInputChange: (name: string, value: string) => void
): React.ReactNode[] => {
  const regex = /\[([a-z]+)([^\]]*)\](.*?)\[\/\1\]/gs; // Добавили флаг `s` для многострочного режима
  const components: React.ReactNode[] = [];

  let lastIndex = 0;

  let match;
  while ((match = regex.exec(bbcode)) !== null) {
    const [, tag, param, content] = match;
    const beforeMatch = bbcode.slice(lastIndex, match.index);
    if (beforeMatch) {
      components.push(beforeMatch); // Добавляем текст до текущего тега
    }

    const parseContent = parseBBCode(content, inputs, onInputChange); // Рекурсивный вызов

    if (tag === "input") {
      const inputName = param.split("=")[1];
      const defaultValue = inputs[inputName] || "";
      components.push(
        <Input
          onChange={(e) => onInputChange(inputName, e.target.value)}
          defaultValue={defaultValue}
          required
          className="w-min inline my-1"
          type="text"
          autoComplete="off"
          key={components.length}
          name={inputName}
          placeholder={content}
        />
      );
    } else if (tag === "bold") {
      components.push(<b key={components.length}>{parseContent}</b>);
    } else if (tag === "italic") {
      components.push(<i key={components.length}>{parseContent}</i>);
    } else if (tag === "color") {
      const color = param.split("=")[1];
      components.push(
        <span style={{ color }} key={components.length}>
          {parseContent}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  const remainingText = bbcode.slice(lastIndex);
  if (remainingText) {
    components.push(remainingText);
  }

  return components;
};

export default parseBBCode;
