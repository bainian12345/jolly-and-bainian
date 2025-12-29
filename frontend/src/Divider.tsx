function Divider({
  width = "100%",
  height = 90,
  color = "currentColor",
}) {
  return (
    <div className="ultra-fancy-divider">
      <svg
        viewBox="0 0 1600 90"
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Long thin outer lines */}
        <path d="M0 45 H500" stroke={color} strokeWidth="1.4" fill="none" />
        <path d="M1100 45 H1600" stroke={color} strokeWidth="1.4" fill="none" />

        {/* Left terminal flourish */}
        <path
          d="
            M500 45
            C530 10, 600 10, 620 45
            C640 80, 580 85, 550 65
            C520 45, 550 25, 585 30
            C620 35, 610 55, 580 50
          "
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Right terminal flourish (mirror) */}
        <path
          d="
            M1100 45
            C1070 10, 1000 10, 980 45
            C960 80, 1020 85, 1050 65
            C1080 45, 1050 25, 1015 30
            C980 35, 990 55, 1020 50
          "
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Central grand scroll */}
        <path
          d="
            M620 45
            C680 -10, 920 -10, 980 45
            C1010 70, 960 95, 900 75
            C840 55, 800 20, 800 20
            C800 20, 760 55, 700 75
            C640 95, 590 70, 620 45
          "
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Inner ornamental loops */}
        <path
          d="
            M760 45
            C770 30, 830 30, 840 45
            C830 60, 770 60, 760 45
          "
          fill="none"
          stroke={color}
          strokeWidth="1.3"
        />

        <path
          d="
            M720 45
            C735 15, 865 15, 880 45
          "
          fill="none"
          stroke={color}
          strokeWidth="1.1"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}
  
export default Divider;