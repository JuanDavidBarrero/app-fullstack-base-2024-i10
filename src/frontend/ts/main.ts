class DeviceManager {
    constructor() {
        this.init();
    }

    private init() {
        document.addEventListener('DOMContentLoaded', async () => {
            await this.loadDevices();
            this.setupRemoveButtons();
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
        return data.id;
    }

    private createDeviceCard(deviceName: string, deviceDescription: string, isSwitch: boolean, id: string) {
        const cardContainer = document.querySelector('.row') as HTMLElement;

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
                    ${isSwitch ? this.createSwitch(id, deviceName) : this.createSlider(id, deviceName)}
                    <button class="btn red remove-btn" data-id="${id}" style="margin-left: 10px;">Eliminar</button>
                </div>
            </div>
        `;

        cardContainer.appendChild(newCard);

        this.setupRemoveButtons();
        this.setupSwitches();
        this.setupSliders();
    }

    private createSwitch(id: string, name: string): string {
        return `
            <div class="switch">
                <label>
                    Off
                    <input type="checkbox" data-id="${id}" data-name="${name}">
                    <span class="lever"></span>
                    On
                </label>
            </div>
        `;
    }

    private createSlider(id: string, name: string): string {
        return `
            <p class="range-field" style="flex: 1;">
                <input type="range" min="0" max="100" value="50" data-id="${id}" data-name="${name}" />
            </p>
            <span id="sliderDisplay-${id}">50</span>
        `;
    }

    private setupSwitches() {
        const switches = document.querySelectorAll('input[type="checkbox"]');
        switches.forEach(switchElement => {
            switchElement.addEventListener('change', async (event) => {
                const target = event.target as HTMLInputElement; // Cast to HTMLInputElement
                const id = target.getAttribute('data-id');
                const name = target.getAttribute('data-name');
                const state = target.checked;

                try {
                    await this.sendDeviceData({ id, name, state });
                } catch (error) {
                    console.error('Error al enviar datos del switch:', error);
                }
            });
        });
    }

    private setupSliders() {
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            const id = slider.getAttribute('data-id');
            const display = document.getElementById(`sliderDisplay-${id}`); // Obtener el elemento de visualización

            slider.addEventListener('input', async (event) => {
                const target = event.target as HTMLInputElement; // Cast to HTMLInputElement
                const value = target.value;

                try {
                    await this.sendDeviceData({ id, name: target.getAttribute('data-name'), value });
                } catch (error) {
                    console.error('Error al enviar datos del slider:', error);
                }

                if (display) {
                    display.textContent = value; // Actualiza el valor mostrado
                }
            });
        });
    }

    private async sendDeviceData(data: { id: string | null, name: string | null, state?: boolean, value?: string }) {
        try {
            const response = await fetch('http://localhost:4000/api/device/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor.');
            }

            const result = await response.json();
            console.log('Datos enviados correctamente:', result);
        } catch (error) {
            console.error('Error al enviar datos al servidor:', error);
        }
    }

}

new DeviceManager();
