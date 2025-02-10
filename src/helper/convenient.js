import { Grid } from "@mui/material";

/**
 * Checks if *obj* is an empty object.
 * @param obj The object to check
 */
export const isEmptyObject = (obj) => {
  return !Number.isInteger(obj) && Object.keys(obj).length === 0;
};

/**
 * Chcecks if *value* is an empty object or an empty array. It will also return _true_ if the *value* is '' (empty string), undefined, null or NaN.
 * @param value The value to check.
 */
export const isEmpty = (value) => {
  if (Array.isArray(value)) {
    if (value.length > 0) {
      return value.filter((x) => !isEmpty(x)).length === 0;
    }
    return value.length === 0;
  }
  if (value instanceof Date) return false;
  return typeof value === "boolean"
    ? false
    : value === undefined ||
        value === null ||
        value.isNan ||
        isEmptyObject(value) ||
        value.toString().replace(/' '/g, "") === "";
};

/**
 * Update the hook for the error popup message with a correct error title and body to display to user.
 * @param errorResponse The error response to display. *errorResponse* in this case will be *e.response*
 */

export const hasError = (errorResponse) => {
  return (
    errorResponse === undefined ||
    !isEmpty(errorResponse.status && errorResponse.status !== 200)
  );
};

/**
 * Update the hook for the error popup message with a correct error title and body to display to user.
 * @param errorResponse
 * @param popupMessageHook The hook to modify the title and content to the corresponding error code and message.
 */
export const renderErrorDialogHook = (errorResponse, popupMessageHook) => {
  if (hasError(errorResponse)) {
    popupMessageHook.modifyDialogTitle(
      `Server Error Code: ${errorResponse.status}`
    );
    popupMessageHook.modifyDialogContent(
      errorResponse.data.error || errorResponse.data
    );
    popupMessageHook.modifyShowErrorIcon(true);
    popupMessageHook.modifyIsDelete(false);
    popupMessageHook.modifyOpen(true);
    popupMessageHook.modifyOnClickActionButton(false);
  }
  return errorResponse;
};

/**
 * Filter *object* with *objectFilter* in the form of { key: []} - object of key-arrays
 * @param object E.g. {keyA: [1,2,3], keyB: [1,2,3], keyC: [1,2,3]}
 * @param objectFilter E.g. { keyA: [1,3], keyB: [2], keyC: []}
 * @return E.g. {keyA:[2], keyB: [1,3], keyC: [1,2,3]}
 */
export const filterObjectFromAnotherObject = (object, objectFilter) => {
  const newObject = { ...object };
  Object.keys(object).map((key) => {
    if (Object.keys(objectFilter).includes(key)) {
      newObject[key] = object[key].filter(
        (item) => !objectFilter[key].includes(item)
      );
    }
  });
};

/**
 * Add or Subtract number of years, months, or days from the current *date*
 * @param date The date to add or subtract the offset for year, month and day.
 * @param yearOffset The offset for year to add/subtract (e.g. -1 means deduct 1 year from the given *date*)
 * @param monthOffset The offset for month to add/subtract (e.g. -1 means deduct 1 month from the given *date* )
 * @param dayOffset The offset for day to add/subtract (e.g. -1 means deduct 1 day from the given *date* )
 * @param hourOffset The offset for hour to add/subtract (e.g. -1 means deduct 1 hour from the given *date* )
 * @param minuteOffset The offset for minute to add/subtract (e.g. -1 means deduct 1 minute from the given *date* )
 * @param secondOffset The offset for second to add/subtract (e.g. -1 means deduct 1 second from the given *date* )
 *
 */
export const dateOffset = (
  date,
  yearOffset = 0,
  monthOffset = 0,
  dayOffset = 0,
  hourOffset = 0,
  minuteOffset = 0,
  secondOffset = 0
) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return new Date(
    year + yearOffset,
    month + monthOffset,
    day + dayOffset,
    hour + hourOffset,
    minute + minuteOffset,
    second + secondOffset
  );
};

/**
 * Checks if *value* is included in an array of objects based on the *key*.
 * @param value The value to check.
 * @param array An array of objects.
 * @param key The key of the object in the *array*.
 */
export const isInArrayObjects = (value, array, key) => {
  if (Array.isArray(array) && !isEmpty(value)) {
    let isInArray = false;
    array.map((item) => {
      if (item[key] === value) {
        isInArray = true;
      }
    });
    return isInArray;
  }
  return false;
};

/**
 * Check if every items in the *array* is Equal. (Note: Does not work for objects)
 * @param array The Array that will be checked if everything is equal
 */

export const allEqual = (array) => {
  return array.every((val, i, arr) => val === arr[0]);
};

/**
 * Check *value* to determine whether a default value should be returned its place. The *defaultValue* is returned if value is NaN, null or undefined.
 * @param value The value to check,
 * @param defaultValue The default value.
 */
export const defaultTo = (value, defaultValue) => {
  if (typeof value == "boolean") return value;
  return value === undefined || value === null || value.isNan || isEmpty(value)
    ? defaultValue
    : value;
};

/**
 * Sort the array of objects with the *key* attribute
 * @param array Array of objects to sort with a specific key. For strings only
 * @param key (string) The name of the key for sorting.
 * @param descending (boolean) Sort the array in descending order. Default: false
 */

export const sortArrayOfObjectsByKey = (array, key, descending = false) => {
  return array.sort((a, b) => {
    const keyA = a[key];
    const keyB = b[key];
    if (keyA?.toLowerCase() < keyB?.toLowerCase()) return descending ? 1 : -1;
    if (keyA?.toLowerCase() > keyB?.toLowerCase()) return descending ? -1 : 1;
    return 0;
  });
};

/**
 * Trancate the given *string* to a certain number of characters (*limit*) and apprend "..." behind.
 * @param string The string to be truncated.
 * @param limit Number of characters to be limited / shown before "...".
 */
export const truncate = (string, limit) => {
  if (isEmpty(string)) return string;
  return string.length > limit
    ? string.substr(0, limit).trim() + "..."
    : string;
};

/**
 * Round the number to the specified number of decimal places
 * @param num The number to be rounded
 * @param decimal The number of decimal places
 */

export const roundToDecimal = (num, decimal) => {
  return +(Math.round(num + `e+${decimal}`) + `e-${decimal}`);
};

/**
 * Replaces a substring of an *originalString* with an *insertItem*
 * @param start The starting index in the *originalString* to be replaced by the *insertItem*.
 * @param end The ending index in the *originalString* to be replaced by the *insertItem*
 * @param originalString The original string.
 * @param insertItem The replacement item.
 */
export const replaceBetween = (start, end, originalString, insertItem) => {
  return (
    originalString?.substring(0, start) +
    insertItem +
    originalString?.substring(end)
  );
};

/**
 * Copy a string text *textToCopy* into the clipboard.
 * @param textToCopy The string text to be copied to clipboard
 */
export const copyToClipboard = (textToCopy) => {
  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method
    return navigator.clipboard.writeText(textToCopy);
  } else {
    // text area method
    let textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // make the textarea out of viewport
    textArea.style.position = "absolute";
    textArea.style.left = "-9999999px";
    textArea.style.top = "-9999999px";
    textArea.style.opacity = 0;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      document.execCommand("copy") ? res() : rej();
      textArea.remove();
    });
  }
};

const isObject = (obj) => {
  return !isEmpty(obj) && typeof obj === "object";
};

/**
 * Checks wheather *obj1* and *obj2* are the same object with the same key-value pairs (nested). A simple obj1 === obj2 will always return *false*.
 * @param obj1 The first object to compare
 * @param obj2 The second object to compare
 */
export const isEqualObjects = (obj1, obj2) => {
  if (isEmpty(obj1) || isEmpty(obj2)) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => {
    const val1 = obj1[key];
    const val2 = obj2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !isEqualObjects(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }

    return true;
  });
};

/**
 * Generates a random array of integers
 * @param size The length of the array
 * @param min The min value
 * @param max The max value
 */
export const generateRandomArray = (size, min, max) => {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min) + min)
  );
};

/**
 * Generates a random number in the range (min and max includes)
 * @param min The min value
 * @param max The max value
 */
export const generateRandomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Animate the number to count from *start* to *end* based on the *duration*.
 * @param id The id string name for the element rendered.
 * @param value The value after the animation ends.
 * @param duration The duration of the animation (in milliseconds).
 */
export const animateValue = (id, value, duration) => {
  const obj = document.getElementById(id);
  const range = value - 0;
  const minTimer = 50;
  let stepTime = Math.abs(Math.floor(duration / range));
  stepTime = Math.max(stepTime, minTimer);

  const startTime = new Date().getTime();
  const endTime = startTime + duration;

  const run = () => {
    const now = new Date().getTime();
    const remaining = Math.max((endTime - now) / duration, 0);
    const counter = Math.round(value - remaining * range);
    obj.innerHTML = counter;
    if (counter === value) clearInterval(timer);
  };

  const timer = setInterval(run, stepTime);
  run();
};

/**
 * Adds a red color asterisk to text
 * @param text The Input Text
 * @param asteriskColor The asterisk color (Defualt = Red)
 */
export const createTextWithAsterisk = (text, asteriskColor = "red") => {
  return (
    <Grid>
      <span style={{ color: asteriskColor }}>*</span>
      <span>{` ${text}`}</span>
    </Grid>
  );
};

/**
 * Remote the key from the object
 * @param object The object to have it's key removed
 * @param key The key to remove from object
 */
export const removeKey = (object, keyRemove) => {
  const removeProp = keyRemove;
  const { [removeProp]: remove, ...objectRest } = object;
  return objectRest;
};

/**
 * Wait for indicated *ms* before proceeding with the code. E.g. Usage: "await wait(1000)"
 * @param ms Wait Duration in Milliseconds.
 */
export const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * Compare with both *array1* and *array2* are equal / similar (objects - reference types)
 * @param array1 The first array to be compared
 * @param array2 The second array to be compared
 */
export const compareArraysOfObjects = (array1, array2) => {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => isEqualObjects(value, array2[index]))
  );
};

/**
 * Compare with both *array1* and *array2* are equal / similar (non objects - primitive types)
 * @param array1 The first array to be compared
 * @param array2 The second array to be compared
 */
export const compareArrays = (array1, array2) => {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])
  );
};

/**
 * Convert string/int numbers that are greate than 1000 with comma (i.e. 1000 -> 1,000 ; 1000000 -> 1,000,000)
 * @param value The string/int numbers
 */
export const numbersAddCommas = (value) => {
  return parseInt(value).toLocaleString("en-US");
};

/**
 * Check if @param dateCheck is between @param dateFrom and @param dateTo
 *
 * @param {String} dateFrom YYYY-MM-DD (E.g. "2022-08-19")
 * @param {String} dateTo YYYY-MM-DD (E.g. "2022-08-29")
 * @param {String} dateCheck YYYY-MM-DD (E.g. "2022-08-21")
 * @returns {Boolean}
 */
export const checkDateIsBetween = (dateFrom, dateTo, dateCheck) => {
  if (dateFrom && dateTo && dateCheck) {
    let d1 = dateFrom.split("-");
    let d2 = dateTo.split("-");
    let c = dateCheck.split("-");

    let from = new Date(d1[0], parseInt(d1[1] - 1), d1[2]);
    let to = new Date(d2[0], parseInt(d2[1] - 1), d2[2]);
    let check = new Date(c[0], parseInt(c[1] - 1), c[2]);

    return check > from && check < to;
  }
  return false;
};

/**
 * Capitaliza all of the first letter in a *text*. e.g. THIS IS A TEXT => This Is A Test
 * @param text The text to capitalize on the first letter. e.g. THIS IS A TEST
 */
export const capitalizeFirstLetter = (text) => {
  if (text.includes(" ")) {
    const textSplit = text.split(" ");
    const result = textSplit.map((x) => capitalizeFirstLetter(x));
    return result.join(" ");
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Convert HSL to RGB
 * This function converts HSL color to RGB format which can be used for luminance calculation.
 *
 * @param {number} h - The hue of the color (0 to 360 degrees).
 * @param {number} s - The saturation of the color (0 to 100%).
 * @param {number} l - The lightness of the color (0 to 100%).
 * @returns {Object} The RGB representation of the color as {r, g, b}.
 */
export const hslToRgb = (h, s, l) => {
  s /= 100;
  l /= 100;

  // Calculate Chroma (C), X, and m values
  const C = (1 - Math.abs(2 * l - 1)) * s;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - C / 2;

  let r, g, b;

  // Determine RGB components based on the Hue (h) angle
  if (h >= 0 && h < 60) {
    r = C;
    g = X;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = X;
    g = C;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = C;
    b = X;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = X;
    b = C;
  } else if (h >= 240 && h < 300) {
    r = X;
    g = 0;
    b = C;
  } else {
    r = C;
    g = 0;
    b = X;
  }

  // Convert the values to RGB between 0-255 and return
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
};

/**
 * Get the contrast color (black or white) based on the luminance of a given HSL color.
 *
 * This function calculates the luminance of a color in RGB format and determines whether the contrast
 * color should be black or white for better readability.
 *
 * @param {string} hsl - The HSL color string, e.g. 'hsl(109, 87.20%, 36.90%)'.
 * @returns {string} 'black' or 'white' depending on the luminance of the HSL color.
 */
export const getContrastColor = (hsl) => {
  // Extract the HSL values from the string (HSL format: 'hsl(hue, saturation%, lightness%)')
  const [h, s, l] = hsl.match(/\d+/g).map(Number);

  // Convert the HSL color to RGB
  const { r, g, b } = hslToRgb(h, s, l);

  // Calculate the luminance based on RGB values
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;

  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;

  // Return 'black' for light colors, 'white' for dark colors
  return luminance > 0.5 ? "black" : "white";
};
