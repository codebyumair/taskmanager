import React from "react";

const FormField = ({ title, inputValue, updateValue, placeholder }) => {
  const onChange = (e) => {
    updateValue(e.target.value);
  };

  return (
    <div>
      <label
        htmlFor="value"
        className="block text-sm  mb-2 font-medium text-gray-700 uppercase"
      >
        {title}
      </label>
      <input
        type="text"
        id="value"
        name="value"
        value={inputValue}
        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default FormField;
