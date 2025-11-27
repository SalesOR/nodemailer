document.addEventListener("DOMContentLoaded", () => {
  const telefoneInput = document.getElementById("telefone");

  telefoneInput.addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\D/g, "");
    
    if (valor.length > 11) {
      valor = valor.slice(0, 11);
    }
    
    if (valor.length <= 2) {
      e.target.value = valor.replace(/^(\d{0,2})/, "($1");
    } else if (valor.length <= 6) {
      e.target.value = valor.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
    } else if (valor.length <= 10) {
      e.target.value = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      e.target.value = valor.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
  });

  telefoneInput.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      return;
    }
    
    if (!/\d/.test(e.key) && e.key !== "Tab") {
      e.preventDefault();
    }
  });
});