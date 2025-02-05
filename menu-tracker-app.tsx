import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit2 } from 'lucide-react';

export default function MenuTracker() {
  const [groups, setGroups] = useState([{
    id: 1,
    name: "Table 1",
    isEditingName: false,
    people: [{
      name: "Person 1",
      isEditingName: false,
      orders: []
    }]
  }]);

  const [charges, setCharges] = useState([
    { name: 'Service', percentage: 0 },
    { name: 'Tips', percentage: 0 }
  ]);

  const [newItem, setNewItem] = useState({
    dish: "",
    price: ""
  });

  // Rest of the state management functions remain the same
  const editGroupName = (groupId, newName) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, name: newName } : group
    ));
  };

  const editPersonName = (groupId, personIndex, newName) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        const newPeople = [...group.people];
        newPeople[personIndex] = {
          ...newPeople[personIndex],
          name: newName
        };
        return { ...group, people: newPeople };
      }
      return group;
    }));
  };

  const setGroupEditingState = (groupId, state) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, isEditingName: state } : group
    ));
  };

  const setPersonEditingState = (groupId, personIndex, state) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        const newPeople = [...group.people];
        newPeople[personIndex] = {
          ...newPeople[personIndex],
          isEditingName: state
        };
        return { ...group, people: newPeople };
      }
      return group;
    }));
  };

  const updateCharge = (index, field, value) => {
    const newCharges = [...charges];
    newCharges[index] = { ...newCharges[index], [field]: value };
    setCharges(newCharges);
  };

  const addItemToPerson = (groupId, personIndex, item) => {
    if (!item.dish || !item.price) return;
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        const newPeople = [...group.people];
        newPeople[personIndex] = {
          ...newPeople[personIndex],
          orders: [...newPeople[personIndex].orders, {...item}]
        };
        return { ...group, people: newPeople };
      }
      return group;
    }));
  };

  const addPerson = (groupId) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        if (group.people.length >= 6) {
          alert("Maximum 6 people per table allowed");
          return group;
        }
        return {
          ...group,
          people: [...group.people, {
            name: `Person ${group.people.length + 1}`,
            isEditingName: false,
            orders: []
          }]
        };
      }
      return group;
    }));
  };

  const addGroup = () => {
    setGroups([...groups, {
      id: groups.length + 1,
      name: `Table ${groups.length + 1}`,
      isEditingName: false,
      people: [{
        name: "Person 1",
        isEditingName: false,
        orders: []
      }]
    }]);
  };

  const calculateSubTotal = (orders) => {
    return orders.reduce((sum, item) => sum + parseFloat(item.price), 0);
  };

  const calculateTotal = (orders) => {
    const subtotal = calculateSubTotal(orders);
    const extraCharges = charges.reduce((sum, charge) => {
      return sum + (subtotal * charge.percentage / 100);
    }, 0);
    return (subtotal + extraCharges).toFixed(2);
  };

  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter') {
      callback();
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Dish name"
              value={newItem.dish}
              onChange={(e) => setNewItem({ ...newItem, dish: e.target.value })}
            />
          </div>
          <div className="w-32">
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="Price €"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-4">
          {charges.map((charge, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{charge.name}:</span>
              <input
                type="number"
                className="w-16 p-2 border rounded"
                placeholder="%"
                value={charge.percentage}
                onChange={(e) => updateCharge(index, 'percentage', parseFloat(e.target.value) || 0)}
              />
              <span>%</span>
            </div>
          ))}
        </div>
        
        <div className="text-sm text-gray-600 italic">
          A table-unit must be 6 people max
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <Card key={group.id} className="p-4">
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                {group.isEditingName ? (
                  <input
                    type="text"
                    className="text-xl font-bold p-1 border rounded"
                    value={group.name}
                    onChange={(e) => editGroupName(group.id, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, () => setGroupEditingState(group.id, false))}
                    onBlur={() => setTimeout(() => setGroupEditingState(group.id, false), 100)}
                    autoFocus
                  />
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{group.name}</h2>
                    <button
                      className="text-gray-600 hover:text-gray-800"
                      onClick={() => setGroupEditingState(group.id, true)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              <div className="space-y-4">
                {group.people.map((person, personIndex) => (
                  <div key={personIndex} className="border-b pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        {person.isEditingName ? (
                          <input
                            type="text"
                            className="font-semibold p-1 border rounded"
                            value={person.name}
                            onChange={(e) => editPersonName(group.id, personIndex, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, () => setPersonEditingState(group.id, personIndex, false))}
                            onBlur={() => setTimeout(() => setPersonEditingState(group.id, personIndex, false), 100)}
                            autoFocus
                          />
                        ) : (
                          <>
                            <h3 className="font-semibold">{person.name}</h3>
                            <button
                              className="text-gray-600 hover:text-gray-800"
                              onClick={() => setPersonEditingState(group.id, personIndex, true)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => addItemToPerson(group.id, personIndex, newItem)}
                        disabled={!newItem.dish || !newItem.price}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {person.orders.map((item, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span>{item.dish}</span>
                          <span>{item.price}€</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 text-right space-y-1">
                      <div>Subtotal: {calculateSubTotal(person.orders).toFixed(2)}€</div>
                      {charges.map((charge, index) => 
                        charge.percentage > 0 && (
                          <div key={index} className="text-sm text-gray-600">
                            {charge.name} ({charge.percentage}%): 
                            {(calculateSubTotal(person.orders) * charge.percentage / 100).toFixed(2)}€
                          </div>
                        )
                      )}
                      <div className="font-bold">
                        Total: {calculateTotal(person.orders)}€
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="text-green-600 hover:text-green-800"
                  onClick={() => addPerson(group.id)}
                >
                  Add Person
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={addGroup}
      >
        Add Table
      </button>

      <div className="mt-8 text-center text-gray-600 text-sm">
        This calculator app is offered by <a href="http://wrgm.cc/IFWII" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">"Italian food and wine in Ireland"</a> & <a href="http://wrgm.cc/FFA" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">"Fun Food Adventures"</a> Meetups
      </div>
    </div>
  );
}