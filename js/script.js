document.addEventListener('DOMContentLoaded', function() {

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = anchor.getAttribute('href');
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const formOrcamento = document.getElementById('formOrcamento');
    if (formOrcamento) {
        formOrcamento.addEventListener('submit', function(e) {
            const nomeInput = document.getElementById('nome');
            const emailInput = document.getElementById('email'); 
            const telefoneInput = document.getElementById('telefone');

            let isValid = true;
            let errorMessages = [];

            [nomeInput, emailInput, telefoneInput].forEach(input => {
                input.classList.remove('border-red-500');
                input.classList.add('border-gray-300'); 
            });

            if (nomeInput.value.trim() === '') {
                isValid = false;
                errorMessages.push('O campo Nome completo é obrigatório.');
                nomeInput.classList.add('border-red-500');
            }

            if (emailInput.value.trim() === '') {
                isValid = false;
                errorMessages.push('O campo E-mail (para contato) é obrigatório.');
                emailInput.classList.add('border-red-500');
            } else if (!isValidEmail(emailInput.value.trim())) {
                isValid = false;
                errorMessages.push('Por favor, insira um E-mail válido.');
                emailInput.classList.add('border-red-500');
            }

            if (telefoneInput.value.trim() === '') {
                isValid = false;
                errorMessages.push('O campo Telefone é obrigatório.');
                telefoneInput.classList.add('border-red-500');
            }

            if (!isValid) {
                e.preventDefault(); 

                const errorModal = document.createElement('div');
                errorModal.innerHTML = `
                    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem;">
                        <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: left; box-shadow: 0 4px 15px rgba(0,0,0,0.2); max-width: 90%; width: 400px;">
                            <h3 style="font-family: 'Playfair Display', serif; color: #D9534F; font-size: 1.25rem; margin-bottom: 10px;">Erro de Validação</h3>
                            <p style="font-family: 'Lato', sans-serif; color: #333333; margin-bottom: 8px; font-size: 0.875rem;">Por favor, corrija os seguintes erros:</p>
                            <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 15px; font-family: 'Lato', sans-serif; color: #333333; font-size: 0.875rem;">
                                ${errorMessages.map(msg => `<li>${msg}</li>`).join('')}
                            </ul>
                            <button id="closeErrorModal" style="background-color: #B08D57; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer; font-family: 'Lato', sans-serif; font-weight: bold; display: block; margin-left: auto; margin-right: auto; font-size: 0.875rem;">OK</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(errorModal);
                 document.getElementById('closeErrorModal').addEventListener('click', () => {
                    errorModal.remove();
                });
            }
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const copyEmailButton = document.getElementById('copyEmailButton');
    const corporateEmailSpan = document.getElementById('corporateEmail');
    const copyFeedbackSpan = document.getElementById('copyFeedback');

    if (copyEmailButton && corporateEmailSpan && copyFeedbackSpan) {
        copyEmailButton.addEventListener('click', function() {
            const emailToCopy = corporateEmailSpan.textContent;
            
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = emailToCopy;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            
            try {
                document.execCommand('copy'); 
                copyEmailButton.textContent = 'Copiado!';

                setTimeout(() => {
                    copyFeedbackSpan.classList.remove('visible');
                    copyEmailButton.textContent = 'Copiar E-mail';
                }, 2000); 

            } catch (err) {
                console.error('Falha ao copiar o e-mail: ', err);
                copyFeedbackSpan.textContent = 'Falha ao copiar!';
                copyFeedbackSpan.classList.add('visible');
                 setTimeout(() => {
                    copyFeedbackSpan.classList.remove('visible');
                    copyFeedbackSpan.textContent = 'Copiado!'; 
                }, 2000);
            }
            document.body.removeChild(tempTextArea); 
        });
    }

});
