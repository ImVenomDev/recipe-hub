
const Input = ({ label, value, onChange, required, disabled, type = "text", placeholder, className = "" }:any) => (
    <div className={`flex flex-col gap-2 ${className}`}>
        <label className="text-sm font-semibold text-gray-700">{label}{required ? <span className="text-red-500"> *</span> : ""}</label>
        <input type={type} value={value} onChange={onChange} required={required} disabled={disabled} placeholder={placeholder} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-gray-800"/>
    </div>
);

const Select = ({ label, value, required, onChange, children, className = "" }:any) => (
    <div className={`flex flex-col gap-2 ${className}`}>
        <label className="text-sm font-semibold text-gray-700">{label}{required ? <span className="text-red-500"> *</span> : ""}</label>
        <select
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white transition-all text-gray-800 cursor-pointer"
        >
            {children}
        </select>
    </div>
);

const SelectItem = ({ children, textValue }:any) => (
    <option value={textValue || children} className="cursor-pointer">{children}</option>
);

const Button = ({ children, type = "button", onPress, variant = "solid", className = "" }:any) => {
    const baseClasses = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantClasses = variant === "light" 
        ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300 focus:ring-gray-400" 
        : "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl focus:ring-purple-500";
    
    return (
        <button
            type={type}
            onClick={onPress}
            className={`${baseClasses} ${variantClasses} ${className}`}
        >
            {children}
        </button>
    );
};

export { Input, Select, SelectItem, Button };