import axios from "axios";

export const main = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // Extraemos variables de entorno
    const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL;
    const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;
    const SERVICE_TOKEN = process.env.SERVICE_TOKEN;

    // Headers con el token
    const headers = { "SERVICE_TOKEN": SERVICE_TOKEN };

    // Llamada a ms-customer
    const customer = await axios.get(
      `${CUSTOMER_SERVICE_URL}/customers/${body.customerId}`,
      { headers }
    );

    // Crear order llamando a ms-orders
    const order = await axios.post(
      `${ORDER_SERVICE_URL}/orders`,
      {
        customerId: body.customerId,
        items: body.items
      },
      { headers }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Order orchestrated successfully",
        customer: customer.data,
        order: order.data
      })
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
