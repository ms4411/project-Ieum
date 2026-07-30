// 아이콘만 있는 버튼(예: 지도 위 "내 위치" 버튼)은 둥근 아이콘 버튼으로,
// 텍스트가 있는 버튼은 채워진 CTA 버튼으로 자동 렌더링한다.
function Button({ img, name, onClick, type = 'button', variant = 'filled' }) {
  const isIconOnly = Boolean(img) && !name;
  const className = isIconOnly
    ? 'app-button app-button--icon'
    : `app-button app-button--${variant}`;

  return (
    <button type={type} className={className} onClick={onClick}>
      {img && <img src={img} alt="" />}
      {name}
    </button>
  );
}

export default Button;
