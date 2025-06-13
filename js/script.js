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

        // Budget form submission with AJAX
    const formOrcamento = document.getElementById('formOrcamento');
    const submitButton = document.getElementById('submitButton');

    if (formOrcamento) {
        formOrcamento.addEventListener('submit', function(e) {
            // 1. Prevenir o envio padrão do HTML em todos os casos agora
            e.preventDefault();

            // Lógica de validação (permanece a mesma)
            const nomeInput = document.getElementById('nome');
            const emailInput = document.getElementById('email');
            const telefoneInput = document.getElementById('telefone');
            let isValid = true;
            let errorMessages = [];
            [nomeInput, emailInput, telefoneInput].forEach(input => {
                input.classList.remove('border-red-500');
                input.classList.add('border-gray-300');
            });
            if (nomeInput.value.trim() === '') { isValid = false; errorMessages.push('O campo Nome completo é obrigatório.'); nomeInput.classList.add('border-red-500'); }
            if (emailInput.value.trim() === '') { isValid = false; errorMessages.push('O campo E-mail (para contato) é obrigatório.'); emailInput.classList.add('border-red-500'); } 
            else if (!isValidEmail(emailInput.value.trim())) { isValid = false; errorMessages.push('Por favor, insira um E-mail válido.'); emailInput.classList.add('border-red-500'); }
            if (telefoneInput.value.trim() === '') { isValid = false; errorMessages.push('O campo Telefone é obrigatório.'); telefoneInput.classList.add('border-red-500'); }

            // 2. Se a validação falhar, mostra o modal de erro e para
            if (!isValid) {
                showModal('error', errorMessages);
                return;
            }

            // 3. Se a validação passar, desabilita o botão e envia os dados via Fetch
            const formData = new FormData(formOrcamento);
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            fetch(formOrcamento.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    showModal('success');
                    formOrcamento.reset();
                } else {
                    response.json().then(data => {
                        const serverErrors = data.errors ? data.errors.map(err => err.message).join(', ') : 'Tente novamente mais tarde.';
                        showModal('error', [`Ocorreu um erro no servidor: ${serverErrors}`]);
                    });
                }
            }).catch(error => {
                showModal('error', ['Não foi possível conectar ao servidor. Verifique sua conexão.']);
            }).finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar solicitação';
            });
        });
    }

// 4. Nova função para criar e mostrar os modais dinamicamente
function showModal(type, messages = []) {
    const existingModal = document.querySelector('.modal-overlay');
    if(existingModal) existingModal.remove();

    let modalContentHTML = '';

    if (type === 'success') {
        modalContentHTML = `
            <div class="modal-content">
                <div class="success-animation">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-primary-black mb-3">O Primeiro Passo Foi Dado!</h3>
                <p class="text-gray-600 mb-6">Recebemos suas informações e já estamos ansiosos para começar a planejar seu evento. Em breve, um de nossos consultores entrará em contato para transformar sua visão em realidade.</p>
                <button id="closeModal" class="btn btn-gold">Ok, entendi!</button>
            </div>
        `;
    } else { // 'error'
        modalContentHTML = `
            <div class="modal-content !border-t-red-500">
                <h3 class="text-2xl font-bold text-red-500 mb-3">Ocorreu um Erro</h3>
                <ul class="list-disc list-inside text-left text-gray-600 space-y-2 mb-6">
                    ${messages.map(msg => `<li>${msg}</li>`).join('')}
                </ul>
                <button id="closeModal" class="btn btn-gold">Tentar Novamente</button>
            </div>
        `;
    }

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = modalContentHTML;
    document.body.appendChild(modalOverlay);

    // Forçar um reflow para a transição funcionar ao adicionar a classe
    setTimeout(() => {
        modalOverlay.classList.add('visible');
    }, 10);
    
    document.getElementById('closeModal').addEventListener('click', () => {
        modalOverlay.classList.remove('visible');
        // Esperar a transição de fade-out terminar para remover o elemento
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
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
                copyFeedbackSpan.classList.add('visible');
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
