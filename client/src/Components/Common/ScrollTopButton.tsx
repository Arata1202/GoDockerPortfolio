import { ChevronDoubleUpIcon } from '@heroicons/react/20/solid'

interface ScrollTopButtonProps {
    scrollToTop: () => void;
  }
  
  export const ScrollTopButton: React.FC<ScrollTopButtonProps> = ({ scrollToTop }) => {
    return (
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center w-10 h-10 text-white bg-gray-700 shadow hover:bg-white hover:bg-opacity-40 transition-opacity duration-300"
        aria-label="Scroll to top"
        style={{
          transition: 'opacity 0.3s, visibility 0.3s',
        }}
      >
        <ChevronDoubleUpIcon className="h-6 w-6 text-white" aria-hidden="true" />
      </button>
    );
  };
