const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_HOST_URL_Rec;

export const purchaseHistoryUtils = {
  // Add items to purchase history draft
  addItemsToDraft: async (userId: string, items: any[], additionalAmount: number, name?: string, email?: string) => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/purchase-history/user/${encodeURIComponent(userId)}/items`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        additionalAmount,
        name,
        email
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add items to draft: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Remove items from purchase history draft
  removeItemsFromDraft: async (userId: string, productIds: string[]) => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/purchase-history/user/${encodeURIComponent(userId)}/items/delete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _ids: productIds })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to remove items from draft: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Update item quantity in purchase history draft
  updateItemQuantity: async (userId: string, item: any, oldQuantity: number, newQuantity: number) => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/purchase-history/user/${encodeURIComponent(userId)}/items/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item,
        oldQuantity,
        newQuantity
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update item quantity: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Delete draft purchase history
  deleteDraft: async (userId: string) => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/purchase-history/user/${encodeURIComponent(userId)}/draft`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete draft: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Finalize purchase history after payment
  finalizePurchaseHistory: async (userId: string, orderId: string) => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/purchase-history/user/${encodeURIComponent(userId)}/finalize`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to finalize purchase history: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get user's purchase history
  getUserPurchaseHistory: async (userId: string, startDate?: string, endDate?: string) => {
    let url = `${BACKEND_BASE_URL}/api/purchase-history/user/${encodeURIComponent(userId)}`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get purchase history: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get purchase history by order ID
  getPurchaseHistoryByOrderId: async (orderId: string) => {
    const response = await fetch(`${BACKEND_BASE_URL}/api/purchase-history/order/${encodeURIComponent(orderId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get purchase history by order ID: ${response.statusText}`);
    }
    
    return response.json();
  }
}; 