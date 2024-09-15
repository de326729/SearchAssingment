import './style.css';

const Container = ({ children }) => {
    return (
        <div className="custom-responsive-container">
            {children}
        </div>
    );
};

export default Container;
