import AsyncSelect from "react-select/async";

export default function MultiSelectTagDropdown({ defaultValue=[], loadOptions, onChange }) {
  return (
    <AsyncSelect
      defaultValue={defaultValue}
      defaultOptions
      isMulti
      loadOptions={loadOptions}
      className="relative z-20"
      onChange={onChange}
    />
  );
}
