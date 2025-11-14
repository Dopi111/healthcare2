import React from 'react';

const Input = (props) => {
    // 1. Define base classes common to all states
    const baseClasses = "border-[1px] rounded-md font-normal px-3 py-2 transition w-full text-sm";
    
    // 2. Define conditional classes for disabled vs. active/focused states
    const stateClasses = props.disabled 
        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300' // Style when disabled
        : 'bg-white text-black border-gray-300 focus:border-[#e6b800] focus:ring-2 focus:ring-[#e6b800]/50'; // Style when active/focused

    return (
        <input 
            {...props} // 💡 Crucial: Passes all standard HTML attributes (type, name, value, placeholder, id, etc.)
            
            // Combine base, state, and custom classes (props.className)
            className={`${baseClasses} ${stateClasses} ${props.className}`}
        />
    );
};

export default Input;