const Spinner = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ margin: '0 auto', background: 'none', display: 'block' }}
            width="211px"
            height="211px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
        >
            <circle
                cx="50"
                cy="50"
                fill="none"
                stroke="#4996a2"
                strokeWidth="10"
                r="36"
                strokeDasharray="169.64600329384882 58.548667764616276"
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    repeatCount="indefinite"
                    dur="0.7s"
                    values="0 50 50;360 50 50"
                    keyTimes="0;1"
                ></animateTransform>
            </circle>
        </svg>
    );
};

export default Spinner;
