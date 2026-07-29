function Button({ img, name, onClick }) {
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <button className="box" style={buttonStyle} onClick={onClick}>
      {img && <img src={img} alt="" />}
      {name}
    </button>
  );
}

export default Button;
