import React from "react";
import { WrappedObservable } from "../../screens/helper/wrap-observable";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";

@observer
export class SelectBox<T> extends React.Component<{
  options: T[],
  display: (v: T) => string,
  onSelect?: (v: T) => void
}> {
  render() {

    const wrapperStyle: React.CSSProperties = {

    }

    const selectStyle: React.CSSProperties = {
      MozAppearance: 'none',
      WebkitAppearance: 'none',
      appearance: 'none',
      border: 'none',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      background: 'inherit',
      color: 'inherit'
    }
    const optionStyle: React.CSSProperties = {
      MozAppearance: 'none',
      WebkitAppearance: 'none',
      appearance: 'none',
      border: 'none',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      background: 'inherit',
    }

    return (
      <div style={wrapperStyle}>
        <select style={selectStyle}>
          <optgroup style={optionStyle}>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </optgroup>
        </select>
      </div>
    )
  }
}