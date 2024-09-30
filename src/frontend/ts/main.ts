class DeviceManager {
    constructor() {
        this.init();
    }

    private init() {
        document.addEventListener('DOMContentLoaded', async () => {
            await this.loadDevices(); 
            this.setupRemoveButtons();
            this.setupSlider();
            this.setupModal();
            this.setupCreateDeviceButton();
        });
    }

    private async loadDevices() {
        try {
            const response = await fetch('http://localhost:4000/api/device'); 
            const devices = await response.json();
            devices.forEach((device: any) => {
                this.createDeviceCard(device.name, device.description, device.iscardswitch, device.id);
            });
        } catch (error) {
            console.error('Error al cargar dispositivos:', error);
        }
    }

    private setupRemoveButtons() {
        const removeBtns = document.querySelectorAll('.remove-btn');
        removeBtns.forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                if (id) {
                    await this.removeDevice(id); 
                }
            });
        });
    }

    private async removeDevice(id: string) {
        try {
            // Realizar la llamada DELETE a la API
            const response = await fetch(`http://localhost:4000/api/device/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el dispositivo.');
            }

            const card = document.querySelector(`button[data-id="${id}"]`)?.closest('.card');
            if (card) {
                card.parentElement?.removeChild(card);
            }
        } catch (error) {
            console.error('Error al eliminar dispositivo:', error);
        }
    }

    private setupSlider() {
        const slider = document.getElementById('sliderValue') as HTMLInputElement;
        const sliderDisplay = document.getElementById('sliderDisplay') as HTMLElement;

        slider?.addEventListener('input', () => {
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
        document.getElementById('createDeviceBtn')?.addEventListener('click', async () => {
            const deviceName = (document.getElementById('deviceName') as HTMLInputElement).value;
            const deviceDescription = (document.getElementById('deviceDescription') as HTMLInputElement).value;
            const isSwitch = (document.getElementById('isSwitch') as HTMLInputElement).checked;

            if (deviceName && deviceDescription) {
                try {
                    const deviceId = await this.createDevice(deviceName, deviceDescription, isSwitch);
                    this.createDeviceCard(deviceName, deviceDescription, isSwitch, deviceId);
                    this.closeModal();
                } catch (error) {
                    alert(error.message);
                }
            } else {
                alert("Por favor, completa todos los campos.");
            }
        });
    }

    private async createDevice(name: string, description: string, isSwitch: boolean): Promise<string> {
        const response = await fetch('http://localhost:4000/api/device', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description,
                iscardswitch: isSwitch
            })
        });
        
        const data = await response.json();
        return data.id; // Retorna el ID del nuevo dispositivo
    }

    private createDeviceCard(deviceName: string, deviceDescription: string, isSwitch: boolean, id: string) {
        const cardContainer = document.querySelector('.row') as HTMLElement;

        // Crea el HTML del dispositivo (card)
        const newCard = document.createElement('div');
        newCard.classList.add('col', 's12', 'm6');
        newCard.innerHTML = `
            <div class="card">
                <div class="card-content">
                    <span class="card-title">
                        <i class="material-icons left">${isSwitch ? 'devices' : 'tune'}</i>
                        ${deviceName}
                    </span>
                    <p>${deviceDescription}</p>
                </div>
                <div class="card-action" style="display: flex; align-items: center; justify-content: space-between;">
                    ${isSwitch ? this.createSwitch(id) : this.createSlider(id)}
                    <button class="btn red remove-btn" data-id="${id}" style="margin-left: 10px;">Eliminar</button>
                </div>
            </div>
        `;

      
        cardContainer.appendChild(newCard);

        this.setupRemoveButtons();
        this.setupSlider();
    }

    private createSwitch(id: string): string {
        return `
            <div class="switch">
                <label>
                    Off
                    <input type="checkbox">
                    <span class="lever"></span>
                    On
                </label>
            </div>
        `;
    }

    private createSlider(id: string): string {
        return `
            <p class="range-field" style="flex: 1;">
                <input type="range" id="sliderValue" min="0" max="100" value="50"/>
            </p>
            <span id="sliderDisplay">50</span>
        `;
    }
}

new DeviceManager();
