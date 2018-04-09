export const caret = (disabled: boolean) => {
  // %23 is base64 encoded for # symbol
  const fillColor = disabled ? '%23ADADAD' : '%23BDC9D6';
  return `url("data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='14' height='7' fill='${fillColor}'>
        <polygon points='0,0 14,0 7,7'/>
    </svg>")
    no-repeat`;
};

export const formatAttributes = (objArray: object[], key: string) => {
  return objArray.map((object: object) => object[key]).join(' / ');
};