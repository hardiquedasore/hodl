export default function calculate_total(diesel: number, electricity: number, transport: number) {
    const diesel_factor = 2.68
    const electricity_factor = 0.81
    const transport_factor = 0.171

    return diesel_factor * diesel + electricity_factor * electricity + transport_factor * transport
}