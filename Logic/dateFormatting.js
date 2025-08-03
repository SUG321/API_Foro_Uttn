function DateMX(date) {
    return date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'America/Matamoros'
    });
}

function TimeMX(date) {
    return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Matamoros'
    });
}

// Exportar ambas funciones
module.exports = {
    DateMX,
    TimeMX
};
