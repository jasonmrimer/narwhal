import * as React from 'react';
import Downshift from 'downshift';
import FilterOption from './widgets/models/FilterOptionModel';
import styled from 'styled-components';
import * as classNames from 'classnames';
import { caret } from './utils/StyleUtils';

interface Props {
  onChange: (e: FilterOption) => void;
  items: FilterOption[];
  placeholder: string;
  className?: string;
}

const filterOptionItems = (items: FilterOption[], inputValue: string | null) => {
  return items.map(item => item).filter(item => {
    return !inputValue || item.label.toLowerCase().includes(inputValue.toLowerCase());
  });
};

const renderOptions = (filteredOptions: FilterOption[], getItemProps: any, highlightedIndex: number | null) => {
  return filteredOptions.map((item, index) => (
    <div
      {...getItemProps({item})}
      key={item.value}
      className={classNames('select-row', {'highlighted': highlightedIndex === index})}
    >
      {item ? item.label : getItemProps.placeholder}
    </div>
  ));
};

export const Select = (props: Props) => {
  return (
    <div className={classNames('styled-select', props.className)}>
      <Downshift
        onChange={props.onChange}
        itemToString={(item: FilterOption) => item.label}
        render={({
                   getInputProps,
                   getItemProps,
                   isOpen,
                   inputValue,
                   selectedItem,
                   highlightedIndex,
                   toggleMenu
                 }) => (
          <div>
            <input onClick={toggleMenu} {...getInputProps({placeholder: props.placeholder})} />
            {isOpen ? (
              <div className="select-box">
                {renderOptions(
                  filterOptionItems(props.items, inputValue),
                  getItemProps,
                  highlightedIndex)
                }
              </div>
            ) : null}
          </div>
        )}
      />
    </div>
  );
};

export default styled(Select)`
  position: relative;
    
  &:after {
    content: ' ';
    background: ${caret(false)};
    right: 0;
    height: 14px;
    width: 20px;
    top: 15px;
    position: absolute;
    pointer-events: none;
  }
  
  input {
    background: transparent;
    padding: 0.5rem 0;
    box-sizing: border-box;
    width: 100%;
    border: none;
    border-bottom: 1px solid gray;
    color: ${props => props.theme.fontColor};
    font-size: 1rem;
  }
  
  .select-row {
    background: ${props => props.theme.lighter};
    color: ${props => props.theme.fontColor};
    padding: 1rem;   
  }
  
  .select-box{
  border: 1px solid ${props => props.theme.fontColor};
  }
  
  .highlighted {
    background: ${props => props.theme.darker};
  }
`;
