local savedPos = nil
local voiceLevel = 33
local hunger, thirst = 100,100

RegisterNUICallback("savePos", function(data)
    savedPos = data
end)

-- Circular minimap
CreateThread(function()
  Wait(1500)
  RequestStreamedTextureDict("circlemap", false)
  while not HasStreamedTextureDictLoaded("circlemap") do Wait(0) end
  AddReplaceTexture("platform:/textures/graphics","radarmasksm","circlemap","radarmasksm")
  SetMinimapClipType(1)
end)

CreateThread(function()
  while true do
    Wait(200)
    local ped=PlayerPedId()
    local coords=GetEntityCoords(ped)

    local health=(GetEntityHealth(ped)-100)
    local armor=GetPedArmour(ped)

    hunger=math.max(0,hunger-0.01)
    thirst=math.max(0,thirst-0.015)

    local heading=math.floor(GetEntityHeading(ped))
    local _, streetHash=GetStreetNameAtCoord(coords.x,coords.y,coords.z)
    local street=GetStreetNameFromHashKey(streetHash)

    local talking=NetworkIsPlayerTalking(PlayerId())
    local voice=talking and voiceLevel or 10

    local inVeh=IsPedInAnyVehicle(ped,false)
    local speed,fuel=0,0

    if inVeh then
      local veh=GetVehiclePedIsIn(ped,false)
      speed=math.floor(GetEntitySpeed(veh)*3.6)
      fuel=math.floor(GetVehicleFuelLevel(veh))
    end

    SendNUIMessage({
      type="update",
      health=math.min(100,health),
      armor=armor,
      hunger=hunger,
      thirst=thirst,
      voice=voice,
      heading=heading,
      street=street,
      inVehicle=inVeh,
      speed=speed,
      fuel=fuel
    })
  end
end)

AddEventHandler('pma-voice:setTalkingMode', function(mode)
    voiceLevel = mode==1 and 33 or mode==2 and 66 or 100
end)
