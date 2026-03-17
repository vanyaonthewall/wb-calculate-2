// WB Design System Generator — Figma Plugin
// Создаёт Component Sets с вариантами + Figma Variables на странице Design System

// ─── SVG иконки (24×24) ───────────────────────────────────────────────────────
var ICONS = {
  'ic-plus':     '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.375 12C21.375 12.2984 21.2565 12.5845 21.0455 12.7955C20.8345 13.0065 20.5484 13.125 20.25 13.125H13.125V20.25C13.125 20.5484 13.0065 20.8345 12.7955 21.0455C12.5845 21.2565 12.2984 21.375 12 21.375C11.7016 21.375 11.4155 21.2565 11.2045 21.0455C10.9935 20.8345 10.875 20.5484 10.875 20.25V13.125H3.75C3.45163 13.125 3.16548 13.0065 2.9545 12.7955C2.74353 12.5845 2.625 12.2984 2.625 12C2.625 11.7016 2.74353 11.4155 2.9545 11.2045C3.16548 10.9935 3.45163 10.875 3.75 10.875H10.875V3.75C10.875 3.45163 10.9935 3.16548 11.2045 2.9545C11.4155 2.74353 11.7016 2.625 12 2.625C12.2984 2.625 12.5845 2.74353 12.7955 2.9545C13.0065 3.16548 13.125 3.45163 13.125 3.75V10.875H20.25C20.5484 10.875 20.8345 10.9935 21.0455 11.2045C21.2565 11.4155 21.375 11.7016 21.375 12Z" fill="FILL_COLOR"/></svg>',
  'ic-minus':    '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.375 12C21.375 12.2984 21.2565 12.5845 21.0455 12.7955C20.8345 13.0065 20.5484 13.125 20.25 13.125H3.75C3.45163 13.125 3.16548 13.0065 2.9545 12.7955C2.74353 12.5845 2.625 12.2984 2.625 12C2.625 11.7016 2.74353 11.4155 2.9545 11.2045C3.16548 10.9935 3.45163 10.875 3.75 10.875H20.25C20.5484 10.875 20.8345 10.9935 21.0455 11.2045C21.2565 11.4155 21.375 11.7016 21.375 12Z" fill="FILL_COLOR"/></svg>',
  'ic-close':    '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.5459 17.9541C19.7572 18.1654 19.876 18.4521 19.876 18.7509C19.876 19.0498 19.7572 19.3365 19.5459 19.5478C19.3346 19.7592 19.0479 19.8779 18.749 19.8779C18.4501 19.8779 18.1635 19.7592 17.9521 19.5478L12 13.5938L6.0459 19.5459C5.83455 19.7573 5.54791 19.876 5.24902 19.876C4.95014 19.876 4.66349 19.7573 4.45215 19.5459C4.2408 19.3346 4.12207 19.048 4.12207 18.7491C4.12207 18.4502 4.2408 18.1635 4.45215 17.9522L10.4062 12L4.45402 6.04595C4.24268 5.8346 4.12395 5.54796 4.12395 5.24907C4.12395 4.95019 4.24268 4.66354 4.45402 4.4522C4.66537 4.24085 4.95201 4.12212 5.2509 4.12212C5.54978 4.12212 5.83643 4.24085 6.04777 4.4522L12 10.4063L17.954 4.45126C18.1654 4.23992 18.452 4.12119 18.7509 4.12119C19.0498 4.12119 19.3364 4.23992 19.5478 4.45126C19.7591 4.66261 19.8778 4.94925 19.8778 5.24814C19.8778 5.54702 19.7591 5.83367 19.5478 6.04501L13.5937 12L19.5459 17.9541Z" fill="FILL_COLOR"/></svg>',
  'ic-chevron':  '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.2959 9.79595L12.7959 17.2959C12.6914 17.4008 12.5672 17.484 12.4304 17.5408C12.2937 17.5976 12.1471 17.6268 11.999 17.6268C11.851 17.6268 11.7043 17.5976 11.5676 17.5408C11.4309 17.484 11.3067 17.4008 11.2021 17.2959L3.70215 9.79595C3.4908 9.5846 3.37207 9.29796 3.37207 8.99907C3.37207 8.70019 3.4908 8.41354 3.70215 8.2022C3.91349 7.99085 4.20014 7.87212 4.49902 7.87212C4.79791 7.87212 5.08455 7.99085 5.2959 8.2022L12 14.9063L18.704 8.20126C18.9154 7.98992 19.202 7.87119 19.5009 7.87119C19.7998 7.87119 20.0864 7.98992 20.2978 8.20126C20.5091 8.41261 20.6278 8.69925 20.6278 8.99814C20.6278 9.29702 20.5091 9.58367 20.2978 9.79501L20.2959 9.79595Z" fill="FILL_COLOR"/></svg>',
  'ic-chevron-2':'<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.875C9.99747 1.875 8.0399 2.46882 6.37486 3.58137C4.70981 4.69392 3.41206 6.27523 2.64572 8.12533C1.87939 9.97543 1.67888 12.0112 2.06955 13.9753C2.46023 15.9393 3.42454 17.7435 4.84055 19.1595C6.25656 20.5755 8.06066 21.5398 10.0247 21.9305C11.9888 22.3211 14.0246 22.1206 15.8747 21.3543C17.7248 20.5879 19.3061 19.2902 20.4186 17.6251C21.5312 15.9601 22.125 14.0025 22.125 12C22.122 9.3156 21.0543 6.74199 19.1562 4.84383C17.258 2.94567 14.6844 1.87798 12 1.875ZM15.0459 11.2041L11.2978 7.45219C11.0865 7.24084 10.7998 7.12211 10.5009 7.12211C10.2021 7.12211 9.91541 7.24084 9.70407 7.45219C9.49272 7.66353 9.37399 7.95018 9.37399 8.24906C9.37399 8.54795 9.49272 8.83459 9.70407 9.04594L12.6563 12L9.70219 14.9541C9.49085 15.1654 9.37212 15.4521 9.37212 15.7509C9.37212 16.0498 9.49085 16.3365 9.70219 16.5478C9.91354 16.7592 10.2002 16.8779 10.4991 16.8779C10.798 16.8779 11.0846 16.7592 11.2959 16.5478L15.0459 12.7978C15.1508 12.6933 15.234 12.5691 15.2908 12.4324C15.3476 12.2956 15.3768 12.149 15.3768 12.0009C15.3768 11.8529 15.3476 11.7063 15.2908 11.5695C15.234 11.4328 15.1508 11.3086 15.0459 11.2041Z" fill="FILL_COLOR"/></svg>',
  'ic-back':     '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15.796 18.7041C16.0073 18.9154 16.1261 19.2021 16.1261 19.5009C16.1261 19.7998 16.0073 20.0865 15.796 20.2978C15.5846 20.5092 15.298 20.6279 14.9991 20.6279C14.7002 20.6279 14.4136 20.5092 14.2022 20.2978L6.70222 12.7978C6.59734 12.6933 6.51413 12.5691 6.45735 12.4324C6.40057 12.2956 6.37134 12.149 6.37134 12.0009C6.37134 11.8529 6.40057 11.7063 6.45735 11.5695C6.51413 11.4328 6.59734 11.3086 6.70222 11.2041L14.2022 3.70407C14.4136 3.49272 14.7002 3.37399 14.9991 3.37399C15.298 3.37399 15.5846 3.49273 15.796 3.70407C16.0073 3.91541 16.1261 4.20206 16.1261 4.50094C16.1261 4.79983 16.0073 5.08647 15.796 5.29782L9.09379 12L15.796 18.7041Z" fill="FILL_COLOR"/></svg>',
  'ic-pencil':   '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.3103 6.87915L17.1216 2.68946C16.9823 2.55014 16.8169 2.43962 16.6349 2.36421C16.4529 2.28881 16.2578 2.25 16.0608 2.25C15.8638 2.25 15.6687 2.28881 15.4867 2.36421C15.3047 2.43962 15.1393 2.55014 15 2.68946L3.43969 14.2507C3.2998 14.3895 3.18889 14.5547 3.11341 14.7367C3.03792 14.9188 2.99938 15.114 3.00001 15.311V19.5007C3.00001 19.8985 3.15804 20.2801 3.43935 20.5614C3.72065 20.8427 4.10218 21.0007 4.50001 21.0007H8.6897C8.88675 21.0013 9.08197 20.9628 9.26399 20.8873C9.44602 20.8118 9.61122 20.7009 9.75001 20.561L21.3103 9.00071C21.4496 8.86142 21.5602 8.69604 21.6356 8.51403C21.711 8.33202 21.7498 8.13694 21.7498 7.93993C21.7498 7.74292 21.711 7.54784 21.6356 7.36582C21.5602 7.18381 21.4496 7.01844 21.3103 6.87915ZM18 10.1895L13.8103 6.00071L16.0603 3.75071L20.25 7.93946L18 10.1895Z" fill="FILL_COLOR"/></svg>',
  'ic-question': '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 16.875C13.5 17.1717 13.412 17.4617 13.2472 17.7084C13.0824 17.955 12.8481 18.1473 12.574 18.2608C12.2999 18.3744 11.9983 18.4041 11.7074 18.3462C11.4164 18.2883 11.1491 18.1454 10.9393 17.9357C10.7296 17.7259 10.5867 17.4586 10.5288 17.1676C10.4709 16.8767 10.5007 16.5751 10.6142 16.301C10.7277 16.0269 10.92 15.7926 11.1666 15.6278C11.4133 15.463 11.7033 15.375 12 15.375C12.3978 15.375 12.7794 15.533 13.0607 15.8143C13.342 16.0956 13.5 16.4772 13.5 16.875ZM22.125 12C22.125 14.0025 21.5312 15.9601 20.4186 17.6251C19.3061 19.2902 17.7248 20.5879 15.8747 21.3543C14.0246 22.1206 11.9888 22.3211 10.0247 21.9305C8.06066 21.5398 6.25656 20.5755 4.84055 19.1595C3.42454 17.7435 2.46023 15.9393 2.06955 13.9753C1.67888 12.0112 1.87939 9.97543 2.64572 8.12533C3.41206 6.27523 4.70981 4.69392 6.37486 3.58137C8.0399 2.46882 9.99747 1.875 12 1.875C14.6844 1.87798 17.258 2.94567 19.1562 4.84383C21.0543 6.74199 22.122 9.3156 22.125 12ZM19.875 12C19.875 10.4425 19.4131 8.91992 18.5478 7.62488C17.6825 6.32985 16.4526 5.32049 15.0136 4.72445C13.5747 4.12841 11.9913 3.97246 10.4637 4.27632C8.93607 4.58017 7.53288 5.3302 6.43154 6.43153C5.3302 7.53287 4.58018 8.93606 4.27632 10.4637C3.97246 11.9913 4.12841 13.5747 4.72445 15.0136C5.32049 16.4526 6.32985 17.6825 7.62489 18.5478C8.91993 19.4131 10.4425 19.875 12 19.875C14.0879 19.8728 16.0896 19.0424 17.566 17.566C19.0424 16.0896 19.8728 14.0879 19.875 12ZM12 6C9.72563 6 7.875 7.68188 7.875 9.75V10.125C7.875 10.4234 7.99353 10.7095 8.20451 10.9205C8.41549 11.1315 8.70164 11.25 9 11.25C9.29837 11.25 9.58452 11.1315 9.7955 10.9205C10.0065 10.7095 10.125 10.4234 10.125 10.125V9.75C10.125 8.92313 10.9688 8.25 12 8.25C13.0313 8.25 13.875 8.92313 13.875 9.75C13.875 10.5769 13.0313 11.25 12 11.25C11.7016 11.25 11.4155 11.3685 11.2045 11.5795C10.9935 11.7905 10.875 12.0766 10.875 12.375V13.125C10.875 13.4234 10.9935 13.7095 11.2045 13.9205C11.4155 14.1315 11.7016 14.25 12 14.25C12.2984 14.25 12.5845 14.1315 12.7955 13.9205C13.0065 13.7095 13.125 13.4234 13.125 13.125V12.375C14.6766 12.0047 15.875 10.9922 15.875 9.75C15.875 7.68188 14.2744 6 12 6Z" fill="FILL_COLOR"/></svg>',
  'ic-list':     '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.875 6C7.875 5.70163 7.99353 5.41548 8.2045 5.2045C8.41548 4.99353 8.70163 4.875 9 4.875H20.25C20.5484 4.875 20.8345 4.99353 21.0455 5.2045C21.2565 5.41548 21.375 5.70163 21.375 6C21.375 6.29837 21.2565 6.58452 21.0455 6.7955C20.8345 7.00647 20.5484 7.125 20.25 7.125H9C8.70163 7.125 8.41548 7.00647 8.2045 6.7955C7.99353 6.58452 7.875 6.29837 7.875 6ZM20.25 10.875H9C8.70163 10.875 8.41548 10.9935 8.2045 11.2045C7.99353 11.4155 7.875 11.7016 7.875 12C7.875 12.2984 7.99353 12.5845 8.2045 12.7955C8.41548 13.0065 8.70163 13.125 9 13.125H20.25C20.5484 13.125 20.8345 13.0065 21.0455 12.7955C21.2565 12.5845 21.375 12.2984 21.375 12C21.375 11.7016 21.2565 11.4155 21.0455 11.2045C20.8345 10.9935 20.5484 10.875 20.25 10.875ZM20.25 16.875H9C8.70163 16.875 8.41548 16.9935 8.2045 17.2045C7.99353 17.4155 7.875 17.7016 7.875 18C7.875 18.2984 7.99353 18.5845 8.2045 18.7955C8.41548 19.0065 8.70163 19.125 9 19.125H20.25C20.5484 19.125 20.8345 19.0065 21.0455 18.7955C21.2565 18.5845 21.375 18.2984 21.375 18C21.375 17.7016 21.2565 17.4155 21.0455 17.2045C20.8345 16.9935 20.5484 16.875 20.25 16.875ZM5.25 4.875H3.75C3.45163 4.875 3.16548 4.99353 2.9545 5.2045C2.74353 5.41548 2.625 5.70163 2.625 6C2.625 6.29837 2.74353 6.58452 2.9545 6.7955C3.16548 7.00647 3.45163 7.125 3.75 7.125H5.25C5.54837 7.125 5.83452 7.00647 6.0455 6.7955C6.25647 6.58452 6.375 6.29837 6.375 6C6.375 5.70163 6.25647 5.41548 6.0455 5.2045C5.83452 4.99353 5.54837 4.875 5.25 4.875ZM5.25 10.875H3.75C3.45163 10.875 3.16548 10.9935 2.9545 11.2045C2.74353 11.4155 2.625 11.7016 2.625 12C2.625 12.2984 2.74353 12.5845 2.9545 12.7955C3.16548 13.0065 3.45163 13.125 3.75 13.125H5.25C5.54837 13.125 5.83452 13.0065 6.0455 12.7955C6.25647 12.5845 6.375 12.2984 6.375 12C6.375 11.7016 6.25647 11.4155 6.0455 11.2045C5.83452 10.9935 5.54837 10.875 5.25 10.875ZM5.25 16.875H3.75C3.45163 16.875 3.16548 16.9935 2.9545 17.2045C2.74353 17.4155 2.625 17.7016 2.625 18C2.625 18.2984 2.74353 18.5845 2.9545 18.7955C3.16548 19.0065 3.45163 19.125 3.75 19.125H5.25C5.54837 19.125 5.83452 19.0065 6.0455 18.7955C6.25647 18.5845 6.375 18.2984 6.375 18C6.375 17.7016 6.25647 17.4155 6.0455 17.2045C5.83452 16.9935 5.54837 16.875 5.25 16.875Z" fill="FILL_COLOR"/></svg>',
};

// ─── Цветовые токены ──────────────────────────────────────────────────────────
var TOKENS = {
  'grey/0':               { r:1,    g:1,    b:1    },
  'grey/50':              { r:.961, g:.961, b:.961 },
  'grey/100':             { r:.922, g:.922, b:.922 },
  'grey/150':             { r:.878, g:.878, b:.878 },
  'grey/300':             { r:.761, g:.761, b:.761 },
  'grey/400':             { r:.678, g:.678, b:.678 },
  'grey/500':             { r:.6,   g:.6,   b:.6   },
  'grey/600':             { r:.482, g:.482, b:.482 },
  'grey/700':             { r:.369, g:.369, b:.369 },
  'grey/800':             { r:.251, g:.251, b:.251 },
  'grey/850':             { r:.192, g:.192, b:.192 },
  'purple/500':           { r:.592, g:.267, b:.922 },
  'secondary-purple/500': { r:.918, g:.855, b:.984 },
  'secondary-purple/600': { r:.875, g:.776, b:.976 },
  'green/500':            { r:0,    g:.741, b:0    },
};

// Сокращения для удобства
var C = {};
var vars = {};
var floatVars = {};
var textStyles = {};

function hex(c) {
  function ch(v) { var h = Math.round(v*255).toString(16); return h.length < 2 ? '0'+h : h; }
  return '#' + ch(c.r) + ch(c.g) + ch(c.b);
}

// ─── FLOAT токены с двумя модами (Comfort / Tiny) ────────────────────────────
var SPACING = {
  'gap/gap-0':           { comfort: 0,  tiny: 0  },
  'gap/gap-3xs':         { comfort: 4,  tiny: 4  },
  'gap/gap-2xs':         { comfort: 8,  tiny: 4  },
  'gap/gap-xs':          { comfort: 12, tiny: 8  },
  'gap/gap-s':           { comfort: 16, tiny: 12 },
  'gap/gap-m':           { comfort: 32, tiny: 24 },
  'gap/gap-l':           { comfort: 40, tiny: 32 },
  'pad/pad-s':           { comfort: 16, tiny: 12 },
  'pad/pad-m':           { comfort: 24, tiny: 16 },
  'pad/pad-l':           { comfort: 32, tiny: 32 },
  'inset/inset-0':       { comfort: 0,  tiny: 0  },
  'inset/inset-2xs':     { comfort: 2,  tiny: 2  },
  'inset/inset-xs':      { comfort: 4,  tiny: 4  },
  'inset/inset-s':       { comfort: 8,  tiny: 6  },
  'inset/inset-m':       { comfort: 12, tiny: 8  },
  'inset/inset-l':       { comfort: 16, tiny: 12 },
  'inset/inset-xl':      { comfort: 24, tiny: 18 },
  'radius/round-xs':     { comfort: 10, tiny: 6  },
  'radius/round-s':      { comfort: 12, tiny: 8  },
  'radius/round-m':      { comfort: 16, tiny: 10 },
  'radius/round-l':      { comfort: 24, tiny: 14 },
  'radius/round-full':   { comfort: 99, tiny: 99 },
  'font-size/f-size-xs': { comfort: 14, tiny: 14 },
  'font-size/f-size-s':  { comfort: 16, tiny: 16 },
  'font-size/f-size-m':  { comfort: 18, tiny: 18 },
  'font-size/f-size-l':  { comfort: 20, tiny: 18 },
  'font-size/f-size-xl': { comfort: 30, tiny: 24 },
  'font-size/f-size-2xl':{ comfort: 44, tiny: 40 },
  'line-height/f-lh-s':  { comfort: 20, tiny: 20 },
  'line-height/f-lh-m':  { comfort: 24, tiny: 24 },
  'line-height/f-lh-l':  { comfort: 40, tiny: 40 },
  'line-height/f-lh-xl': { comfort: 48, tiny: 48 },
};

// ─── Создание Variables ───────────────────────────────────────────────────────
function createVariables() {
  try {
    var col = figma.variables.createVariableCollection('WB Tokens');
    var comfortModeId = col.modes[0].modeId;
    col.renameMode(comfortModeId, 'Comfort');
    var tinyModeId = col.addMode('Tiny');

    // COLOR переменные — одинаковы в обоих модах
    var colorKeys = Object.keys(TOKENS);
    for (var i = 0; i < colorKeys.length; i++) {
      var name = colorKeys[i];
      var v = figma.variables.createVariable(name, col, 'COLOR');
      v.setValueForMode(comfortModeId, TOKENS[name]);
      v.setValueForMode(tinyModeId, TOKENS[name]);
      vars[name] = v;
    }

    // FLOAT переменные — разные значения для Comfort и Tiny
    var spacingKeys = Object.keys(SPACING);
    for (var j = 0; j < spacingKeys.length; j++) {
      var sName = spacingKeys[j];
      var sv = figma.variables.createVariable(sName, col, 'FLOAT');
      sv.setValueForMode(comfortModeId, SPACING[sName].comfort);
      sv.setValueForMode(tinyModeId, SPACING[sName].tiny);
      floatVars[sName] = sv;
    }
  } catch(e) {
    // Variables API недоступна — используем raw значения
  }
}

// ─── Применение цвета (с привязкой к переменной если есть) ───────────────────
function applyFill(node, tokenName, opacity) {
  var color = TOKENS[tokenName];
  if (!color) { color = { r:.192, g:.192, b:.192 }; }
  var paint = { type: 'SOLID', color: color, opacity: (opacity !== undefined ? opacity : 1) };
  if (vars[tokenName]) {
    try {
      paint = figma.variables.setBoundVariableForPaint(paint, 'color', vars[tokenName]);
    } catch(e) {}
  }
  node.fills = [paint];
}

function applyStroke(node, tokenName) {
  var color = TOKENS[tokenName];
  if (!color) { return; }
  var paint = { type: 'SOLID', color: color };
  if (vars[tokenName]) {
    try {
      paint = figma.variables.setBoundVariableForPaint(paint, 'color', vars[tokenName]);
    } catch(e) {}
  }
  node.strokes = [paint];
}

// ─── Привязка FLOAT переменной к свойству ─────────────────────────────────────
function bindVar(node, property, varName) {
  if (floatVars[varName]) {
    try { node.setBoundVariable(property, floatVars[varName]); } catch(e) {}
  }
}

function bindPad(node, t, r, b, l) {
  bindVar(node, 'paddingTop',    t);
  bindVar(node, 'paddingRight',  r);
  bindVar(node, 'paddingBottom', b);
  bindVar(node, 'paddingLeft',   l);
}

// ─── Text Styles ──────────────────────────────────────────────────────────────
function createTextStyles() {
  var styles = [
    { name: 'H1',             family: 'Unbounded', style: 'Bold',      size: 44, lh: 48, fsVar: 'font-size/f-size-2xl', lhVar: 'line-height/f-lh-xl' },
    { name: 'H2',             family: 'Unbounded', style: 'Bold',      size: 30, lh: 40, fsVar: 'font-size/f-size-xl',  lhVar: 'line-height/f-lh-l'  },
    { name: 'H3',             family: 'Unbounded', style: 'Bold',      size: 20, lh: 24, fsVar: 'font-size/f-size-l',   lhVar: 'line-height/f-lh-m'  },
    { name: 'H4',             family: 'Inter',     style: 'Semi Bold', size: 20, lh: 24, fsVar: 'font-size/f-size-l',   lhVar: 'line-height/f-lh-m'  },
    { name: 'text-m',         family: 'Inter',     style: 'Regular',   size: 18, lh: 24, fsVar: 'font-size/f-size-m',   lhVar: 'line-height/f-lh-m'  },
    { name: 'text-m-medium',  family: 'Inter',     style: 'Medium',    size: 18, lh: 24, fsVar: 'font-size/f-size-m',   lhVar: 'line-height/f-lh-m'  },
    { name: 'text-s',         family: 'Inter',     style: 'Regular',   size: 16, lh: 24, fsVar: 'font-size/f-size-s',   lhVar: 'line-height/f-lh-m'  },
    { name: 'text-s-semibold',family: 'Inter',     style: 'Semi Bold', size: 16, lh: 24, fsVar: 'font-size/f-size-s',   lhVar: 'line-height/f-lh-m'  },
    { name: 'text-xs',        family: 'Inter',     style: 'Regular',   size: 14, lh: 20, fsVar: 'font-size/f-size-xs',  lhVar: 'line-height/f-lh-s'  },
  ];
  for (var i = 0; i < styles.length; i++) {
    var s = styles[i];
    try {
      var ts = figma.createTextStyle();
      ts.name = s.name;
      ts.fontName = { family: s.family, style: s.style };
      ts.fontSize = s.size;
      ts.lineHeight = { value: s.lh, unit: 'PIXELS' };
      if (floatVars[s.fsVar]) {
        try { ts.setBoundVariable('fontSize', floatVars[s.fsVar]); } catch(e) {}
      }
      if (floatVars[s.lhVar]) {
        try { ts.setBoundVariable('lineHeight', floatVars[s.lhVar]); } catch(e) {}
      }
      textStyles[s.name] = ts.id;
    } catch(e) {}
  }
}

// ─── Утилиты ──────────────────────────────────────────────────────────────────
function loadFonts() {
  return Promise.all([
    figma.loadFontAsync({ family: 'Inter',     style: 'Regular'   }),
    figma.loadFontAsync({ family: 'Inter',     style: 'Medium'    }),
    figma.loadFontAsync({ family: 'Inter',     style: 'Semi Bold' }),
    figma.loadFontAsync({ family: 'Unbounded', style: 'Bold'      }),
  ]);
}

function makeText(content, family, style, size, lh, tokenName, styleName) {
  var t = figma.createText();
  t.fontName = { family: family, style: style };
  t.characters = String(content);
  t.fontSize = size;
  if (lh) { t.lineHeight = { value: lh, unit: 'PIXELS' }; }
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  applyFill(t, tokenName);
  if (styleName && textStyles[styleName]) {
    try { t.textStyleId = textStyles[styleName]; } catch(e) {}
  }
  return t;
}

function applyFillRecursive(node, colorToken) {
  if (node.fills !== undefined && node.fills !== figma.mixed && node.fills.length > 0) {
    applyFill(node, colorToken);
  }
  if (node.children) {
    for (var ci = 0; ci < node.children.length; ci++) {
      applyFillRecursive(node.children[ci], colorToken);
    }
  }
}

function makeIcon(iconName, colorToken) {
  var svgStr = ICONS[iconName];
  if (!svgStr) { svgStr = ICONS['ic-question']; }
  var hexColor = hex(TOKENS[colorToken] || TOKENS['grey/300']);
  svgStr = svgStr.replace(/fill="FILL_COLOR"/g, 'fill="' + hexColor + '"');
  try {
    var node = figma.createNodeFromSvg(svgStr);
    node.name = iconName;
    applyFillRecursive(node, colorToken);
    return node;
  } catch(e) {
    // fallback: прямоугольник
    var r = figma.createRectangle();
    r.resize(24, 24);
    applyFill(r, colorToken);
    return r;
  }
}

function setHug(comp) {
  comp.primaryAxisSizingMode  = 'AUTO';
  comp.counterAxisSizingMode  = 'AUTO';
}

function setFixedW(comp, w) {
  comp.primaryAxisSizingMode  = 'FIXED';
  comp.counterAxisSizingMode  = 'AUTO';
  comp.resize(w, comp.height || 10);
}

function setPad(node, t, r, b, l) {
  node.paddingTop    = t;
  node.paddingRight  = r;
  node.paddingBottom = b;
  node.paddingLeft   = l;
}

function hLayout(comp, align, gap) {
  comp.layoutMode = 'HORIZONTAL';
  comp.primaryAxisAlignItems = align || 'MIN';
  comp.counterAxisAlignItems = 'CENTER';
  comp.itemSpacing = gap || 0;
}

function makeSet(comps, name, pad, gap) {
  var set = figma.combineAsVariants(comps, figma.currentPage);
  set.name = name;
  set.layoutMode = 'HORIZONTAL';
  set.layoutWrap = 'WRAP';
  set.itemSpacing = gap || 16;
  set.counterAxisSpacing = gap || 16;
  setPad(set, pad, pad, pad, pad);
  applyFill(set, 'grey/50');
  set.cornerRadius = 8;
  set.strokes = [{ type: 'SOLID', color: TOKENS['grey/150'] }];
  set.strokeWeight = 1;
  set.primaryAxisSizingMode  = 'AUTO';
  set.counterAxisSizingMode  = 'AUTO';
  return set;
}

// ─── Button ───────────────────────────────────────────────────────────────────
function makeButton(isHover) {
  var comp = figma.createComponent();
  comp.name = 'State=' + (isHover ? 'Hover' : 'Default');
  hLayout(comp, 'CENTER', 0);
  setFixedW(comp, 280);
  setPad(comp, 24, 24, 24, 24);
  bindPad(comp, 'inset/inset-xl', 'inset/inset-xl', 'inset/inset-xl', 'inset/inset-xl');
  comp.cornerRadius = 12;
  bindVar(comp, 'cornerRadius', 'radius/round-s');
  applyFill(comp, isHover ? 'grey/800' : 'grey/850');

  var label = makeText('Рассчитать стоимость', 'Unbounded', 'Bold', 20, 24, 'grey/0', 'H3');
  comp.appendChild(label);
  return comp;
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function makeToggle(checked) {
  var comp = figma.createComponent();
  comp.name = 'Checked=' + (checked ? 'True' : 'False');
  comp.resize(48, 28);
  comp.cornerRadius = 999;
  bindVar(comp, 'cornerRadius', 'radius/round-full');
  comp.clipsContent = false;
  applyFill(comp, checked ? 'green/500' : 'grey/300');

  var dot = figma.createRectangle();
  dot.name = 'Dot';
  dot.resize(20, 20);
  dot.cornerRadius = 999;
  dot.x = checked ? 24 : 4;
  dot.y = 4;
  applyFill(dot, 'grey/0');
  comp.appendChild(dot);
  return comp;
}

// ─── Radio ────────────────────────────────────────────────────────────────────
function makeRadio(checked) {
  var comp = figma.createComponent();
  comp.name = 'Checked=' + (checked ? 'True' : 'False');
  comp.resize(24, 24);
  comp.cornerRadius = 999;
  bindVar(comp, 'cornerRadius', 'radius/round-full');
  applyFill(comp, 'grey/0');
  applyStroke(comp, checked ? 'purple/500' : 'grey/300');
  comp.strokeWeight = 2;
  comp.strokeAlign = 'INSIDE';

  if (checked) {
    var dot = figma.createRectangle();
    dot.name = 'Dot';
    dot.resize(14, 14);
    dot.cornerRadius = 999;
    dot.x = 3; dot.y = 3;
    applyFill(dot, 'purple/500');
    comp.appendChild(dot);
  } else {
    comp.fills = comp.fills; // ensure no children
  }
  return comp;
}

// ─── Ic (иконка с состоянием) ─────────────────────────────────────────────────
var IC_COLOR = { Default: 'grey/300', Hover: 'grey/500', Active: 'grey/700' };

function makeIc(state) {
  var comp = figma.createComponent();
  comp.name = 'State=' + state;
  comp.resize(24, 24);
  comp.fills = [];
  var icon = makeIcon('ic-question', IC_COLOR[state]);
  icon.name = 'Icon';
  comp.appendChild(icon);
  return comp;
}

// ─── Icon (все иконки) ────────────────────────────────────────────────────────
function makeIconComp(iconName) {
  var comp = figma.createComponent();
  var label = iconName.replace('ic-', '');
  comp.name = 'Name=' + label;
  comp.resize(24, 24);
  comp.fills = [];
  var icon = makeIcon(iconName, 'grey/850');
  icon.name = 'Icon';
  comp.appendChild(icon);
  return comp;
}

// ─── IcControl ────────────────────────────────────────────────────────────────
var IC_BG = {
  grey:      { Default:'grey/100', Hover:'grey/150', Active:'grey/850', Disable:'grey/150' },
  secondary: { Default:'secondary-purple/500', Hover:'secondary-purple/600', Active:'purple/500', Disable:'secondary-purple/500' },
};
var IC_ICON_COLOR = {
  grey:      { Default:'grey/500', Hover:'grey/600', Active:'grey/0', Disable:'grey/300' },
  secondary: { Default:'purple/500', Hover:'purple/500', Active:'grey/0', Disable:'purple/500' },
};
var IC_PAD    = { S:8, M:12, L:24 };
var IC_RADIUS = { S:10, M:10, L:16 };

function makeIcControl(color, size, state) {
  var comp = figma.createComponent();
  comp.name = 'Color=' + color + ', Size=' + size + ', State=' + state;
  hLayout(comp, 'CENTER', 0);
  setHug(comp);
  var pad = IC_PAD[size];
  var padVar = size === 'S' ? 'inset/inset-s' : size === 'M' ? 'inset/inset-m' : 'inset/inset-xl';
  var radVar = size === 'L' ? 'radius/round-m' : 'radius/round-xs';
  setPad(comp, pad, pad, pad, pad);
  bindPad(comp, padVar, padVar, padVar, padVar);
  comp.cornerRadius = IC_RADIUS[size];
  bindVar(comp, 'cornerRadius', radVar);
  applyFill(comp, IC_BG[color][state]);

  var opacity = (state === 'Disable') ? 0.4 : 1;
  var iconNode = makeIcon('ic-minus', IC_ICON_COLOR[color][state]);
  if (opacity < 1) { iconNode.opacity = opacity; }
  iconNode.name = 'Icon';
  comp.appendChild(iconNode);
  return comp;
}

// ─── Input ────────────────────────────────────────────────────────────────────
var INPUT_BORDER = { Default:'grey/150', Hover:'grey/100', Focused:'purple/500', Filled:'grey/150' };
var INPUT_BG     = { Default:'grey/0', Hover:'grey/100', Focused:'grey/0', Filled:'grey/0' };

function makeInput(state) {
  var comp = figma.createComponent();
  comp.name = 'State=' + state;
  hLayout(comp, 'SPACE_BETWEEN', 8);
  setFixedW(comp, 280);
  setPad(comp, 12, 16, 12, 16);
  bindPad(comp, 'inset/inset-m', 'inset/inset-l', 'inset/inset-m', 'inset/inset-l');
  comp.cornerRadius = 12;
  bindVar(comp, 'cornerRadius', 'radius/round-s');
  applyFill(comp, INPUT_BG[state]);
  applyStroke(comp, INPUT_BORDER[state]);
  comp.strokeWeight = 2;
  comp.strokeAlign = 'INSIDE';

  var isFilled = (state === 'Filled');
  var inputText = makeText(isFilled ? '35' : 'Введите значение', 'Inter', 'Regular', 18, 24, isFilled ? 'grey/850' : 'grey/500', 'text-m');
  inputText.layoutGrow = 1;
  var unitText  = makeText('м²', 'Inter', 'Regular', 18, 24, 'grey/500', 'text-m');

  comp.appendChild(inputText);
  comp.appendChild(unitText);
  return comp;
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
var CHIP_BG     = { grey:'grey/100', secondary:'secondary-purple/500' };
var CHIP_TXT    = { grey:'grey/700', secondary:'purple/500' };
var CHIP_PAD_H  = { M:12, S:8 };
var CHIP_PAD_V  = { M:4,  S:2 };
var CHIP_RADIUS = { M:10, S:999 };
var CHIP_FS     = { M:16, S:14 };
var CHIP_LH     = { M:24, S:20 };

function makeChip(color, size) {
  var comp = figma.createComponent();
  comp.name = 'Color=' + color + ', Size=' + size;
  hLayout(comp, 'CENTER', 4);
  setHug(comp);
  var chipPadH = size === 'M' ? 'inset/inset-m' : 'inset/inset-s';
  var chipPadV = size === 'M' ? 'inset/inset-xs' : 'inset/inset-2xs';
  var chipRad  = size === 'M' ? 'radius/round-xs' : 'radius/round-full';
  setPad(comp, CHIP_PAD_V[size], CHIP_PAD_H[size], CHIP_PAD_V[size], CHIP_PAD_H[size]);
  bindPad(comp, chipPadV, chipPadH, chipPadV, chipPadH);
  comp.cornerRadius = CHIP_RADIUS[size];
  bindVar(comp, 'cornerRadius', chipRad);
  applyFill(comp, CHIP_BG[color]);

  var chipStyle = size === 'M' ? 'text-s' : 'text-xs';
  var label = makeText('25 м²', 'Inter', 'Regular', CHIP_FS[size], CHIP_LH[size], CHIP_TXT[color], chipStyle);
  comp.appendChild(label);
  return comp;
}

// ─── Segment ──────────────────────────────────────────────────────────────────
function makeSegment(variant, active) {
  var bg    = active ? (variant === 'Dark' ? 'grey/850' : 'purple/500') : 'grey/0';
  var color = active ? 'grey/0' : 'grey/850';
  var comp = figma.createComponent();
  comp.name = 'Variant=' + variant + ', Active=' + active;
  hLayout(comp, 'CENTER', 0);
  setHug(comp);
  setPad(comp, 8, 8, 8, 8);
  bindPad(comp, 'inset/inset-s', 'inset/inset-s', 'inset/inset-s', 'inset/inset-s');
  comp.cornerRadius = 10;
  bindVar(comp, 'cornerRadius', 'radius/round-xs');
  applyFill(comp, bg);

  var label = makeText('Косметика', 'Inter', 'Regular', 18, 24, color, 'text-m');
  comp.appendChild(label);
  return comp;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  return loadFonts().then(function() {
    // Находим страницу Design System
    var page = null;
    for (var i = 0; i < figma.root.children.length; i++) {
      if (figma.root.children[i].name === 'Design System') {
        page = figma.root.children[i];
        break;
      }
    }
    if (!page) { page = figma.currentPage; }
    figma.currentPage = page;

    // Создаём переменные и стили
    createVariables();
    createTextStyles();

    var sets = [];
    var x = 80;
    var ROW_GAP = 64;
    var ROW1_Y = 80;
    var ROW2_Y, ROW3_Y, ROW4_Y;

    // ── Ряд 1: Button, Toggle, Radio ──────────────────────────────────────────
    var btnSet = makeSet([makeButton(false), makeButton(true)], 'Button', 24, 32);
    btnSet.x = x; btnSet.y = ROW1_Y;
    sets.push(btnSet);
    x += btnSet.width + ROW_GAP;

    var togSet = makeSet([makeToggle(true), makeToggle(false)], 'Toggle', 24, 24);
    togSet.x = x; togSet.y = ROW1_Y;
    sets.push(togSet);
    x += togSet.width + ROW_GAP;

    var radSet = makeSet([makeRadio(true), makeRadio(false)], 'Radio', 24, 24);
    radSet.x = x; radSet.y = ROW1_Y;
    sets.push(radSet);

    // ── Ряд 2: Ic, Icon ───────────────────────────────────────────────────────
    x = 80;
    ROW2_Y = ROW1_Y + 200;

    var icComps = ['Default','Hover','Active'].map(function(s) { return makeIc(s); });
    var icSet = makeSet(icComps, 'Ic', 24, 16);
    icSet.x = x; icSet.y = ROW2_Y;
    sets.push(icSet);
    x += icSet.width + ROW_GAP;

    var iconNames = ['ic-plus','ic-minus','ic-close','ic-chevron','ic-chevron-2','ic-back','ic-pencil','ic-question','ic-list'];
    var iconComps = iconNames.map(function(n) { return makeIconComp(n); });
    var iconSet = makeSet(iconComps, 'Icon', 24, 16);
    iconSet.x = x; iconSet.y = ROW2_Y;
    sets.push(iconSet);

    // ── Ряд 3: IcControl ──────────────────────────────────────────────────────
    x = 80;
    ROW3_Y = ROW2_Y + 200;

    var icCtrlComps = [];
    var clrs = ['grey','secondary'];
    var szs  = ['S','M','L'];
    var sts  = ['Default','Hover','Active','Disable'];
    for (var ci = 0; ci < clrs.length; ci++) {
      for (var si = 0; si < szs.length; si++) {
        for (var sti = 0; sti < sts.length; sti++) {
          icCtrlComps.push(makeIcControl(clrs[ci], szs[si], sts[sti]));
        }
      }
    }
    var icCtrlSet = makeSet(icCtrlComps, 'IcControl', 24, 12);
    icCtrlSet.x = x; icCtrlSet.y = ROW3_Y;
    sets.push(icCtrlSet);

    // ── Ряд 4: Input, Chip, Segment ───────────────────────────────────────────
    x = 80;
    ROW4_Y = ROW3_Y + (icCtrlSet.height + ROW_GAP);

    var inputComps = ['Default','Hover','Focused','Filled'].map(function(s) { return makeInput(s); });
    var inputSet = makeSet(inputComps, 'Input', 24, 24);
    inputSet.x = x; inputSet.y = ROW4_Y;
    sets.push(inputSet);
    x += inputSet.width + ROW_GAP;

    var chipComps = [];
    var chipClrs = ['grey','secondary'];
    var chipSzs  = ['M','S'];
    for (var chi = 0; chi < chipClrs.length; chi++) {
      for (var csi = 0; csi < chipSzs.length; csi++) {
        chipComps.push(makeChip(chipClrs[chi], chipSzs[csi]));
      }
    }
    var chipSet = makeSet(chipComps, 'Chip', 24, 16);
    chipSet.x = x; chipSet.y = ROW4_Y;
    sets.push(chipSet);
    x += chipSet.width + ROW_GAP;

    var segComps = [];
    var segVars = ['Default','Dark'];
    var segActs = [true, false];
    for (var svi = 0; svi < segVars.length; svi++) {
      for (var sai = 0; sai < segActs.length; sai++) {
        segComps.push(makeSegment(segVars[svi], segActs[sai]));
      }
    }
    var segSet = makeSet(segComps, 'Segment', 24, 16);
    segSet.x = x; segSet.y = ROW4_Y;
    sets.push(segSet);

    figma.viewport.scrollAndZoomIntoView(sets);
    figma.closePlugin('✅ Примитивы созданы' + (Object.keys(vars).length > 0 ? ' + Variables!' : '!'));
  });
}

main().catch(function(err) {
  figma.closePlugin('Ошибка: ' + err.message);
});
