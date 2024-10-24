
function SubmitButton({buttonTitle}){
    return(
         <div>
            <button 
            style={
                {
                    color: "var(--background-color)",
                    width: "100%",
                    fontSize: "var(--font-size-normal)",
                    background: 'linear-gradient(45deg, var(--green) 30%, var(--green) 30%)',
                    borderRadius: 3,
                    border: 0,
                    height: 48,
                    padding: '0 30px',
                    
                    '&:hover': {
                        backgroundColor: 'var(--text-primary)',
                    }
                }
             }
            type="submit">
                {buttonTitle}
            </button>
         </div>
    );
}

export default SubmitButton;