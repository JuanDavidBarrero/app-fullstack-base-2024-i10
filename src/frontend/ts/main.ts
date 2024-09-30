class DeviceManager {
    constructor() {
        this.init();
    }

    private init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupRemoveButtons();
            this.setupSlider();
            this.setupModal();
            this.setupCreateDeviceButton();
        });
    }

    private setupRemoveButtons() {
        const removeBtns = document.querySelectorAll('.remove-btn');
        removeBtns.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                if (id) {
                    this.removeDevice(id);
                }
            });
        });
    }

    private removeDevice(id: string) {
        alert(`Hola Mundo! ID: ${id}`);
        const card = document.querySelector(`button[data-id="${id}"]`)?.closest('.card');
        if (card) {
            card.parentElement?.removeChild(card);
        }
    }

    private setupSlider() {
        const slider = document.getElementById('sliderValue') as HTMLInputElement;
        const sliderDisplay = document.getElementById('sliderDisplay') as HTMLElement;

        slider.addEventListener('input', () => {
            sliderDisplay.textContent = slider.value;
        });
    }

    private setupModal() {
        document.getElementById('openModalBtn')?.addEventListener('click', () => {
            const modal = document.getElementById('deviceModal');
            if (modal) {
                modal.style.display = 'block'; 
            }
        });

        document.getElementById('closeModalBtn')?.addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelBtn')?.addEventListener('click', () => {
            this.closeModal();
        });
    }

    private closeModal() {
        const modal = document.getElementById('deviceModal');
        if (modal) {
            modal.style.display = 'none'; 
        }
    }

    private setupCreateDeviceButton() {
        document.getElementById('createDeviceBtn')?.addEventListener('click', () => {
            const deviceName = (document.getElementById('deviceName') as HTMLInputElement).value;
            const deviceDescription = (document.getElementById('deviceDescription') as HTMLInputElement).value;
            const isSwitch = (document.getElementById('isSwitch') as HTMLInputElement).checked; // Obtener el valor del switch

            console.log(`Dispositivo Creado: ${deviceName}, Descripción: ${deviceDescription}, ¿Es Switch?: ${isSwitch}`);
            this.closeModal();
        });
    }
}

// Instanciar la clase
new DeviceManager();
