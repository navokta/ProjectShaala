// components/Header/MobileMenu.jsx
const MobileMenu = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="space-y-1 pb-3 pt-2">
        {children}
      </div>
    </div>
  );
};

export default MobileMenu;