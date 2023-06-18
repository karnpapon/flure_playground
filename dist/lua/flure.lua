local js = require "js"
local window = js.global
local document = window.document

local drawer = require "lua.drawer"
local vm = require "lua.vm"
local aw = require "lua.async-await"

local form = document:getElementById('form_submit')
local flure_code = document:getElementById('flure_code')
local form_btn_repl = document:getElementById('form_btn_repl')
local flure_console = document:getElementById('flure_console')

-- taken from: https://stackoverflow.com/a/13398936
local function print_r(arr, indentLevel)
  local str = ""
  local indentStr = "#"

  if (indentLevel == nil) then
    print(print_r(arr, 0))
    return
  end

  for i = 0, indentLevel do indentStr = indentStr .. "\t" end

  -- handle nested table (compound type)
  for index, value in pairs(arr) do
    if type(value) == "table" then
      str = str .. indentStr .. index .. ": \n" ..
                print_r(value, (indentLevel + 1))
    else
      -- otherwise, just print scalar type
      str = str .. indentStr .. index .. ": " .. tostring(value) .. "\n"
    end
  end
  return str
end

local function run_code()
  -- if not flure_code.value then return false end
  vm.build_mode = true
  drawer.init()
  print("------ run_code -------")
  local co = assert(coroutine.running(), "Should be run in a coroutine")
  -- print(coroutine.status(co))
  -- window.flure_value = drawer.render(flure_code.value, "output_img")
  window:setTimeout(function() window.flure_value = drawer.render(flure_code.value, "output_img")  end, 200)
  -- if window.flure_value then
  --   coroutine.yield()
  -- end
  -- return false
end

-- form.onsubmit = aw.async(function()
--   form_btn_repl 
-- end)

local function run_repl(line)
  local return_code = vm.REPL(line)
  if return_code == 1 and vm.compile_flag == false then
    return "ok."
  elseif return_code == 1 and vm.compile_flag then
    return "compiled."
  elseif return_code == 0 then
    return "completed, exit."
  elseif return_code == 2 then
    return "Due to error, input was not processed."
  end
end

form.onsubmit = function()
  -- form_btn_repl 
  vm.build_mode = false
  local res = run_repl(flure_code.value)
  flure_console.innerHTML = res
  return false
end



-- form.onsubmit = coroutine.wrap(function()
--   print("start computing flure codes...")
--   run_code()
--   print("done computing flure codes.")
--   return false
-- end)

-- local function simulatedDelayedCallback(cb, ms)
--   -- window:setTimeout(ms, cb)
--   window:setTimeout(cb(), ms) end

-- local thread = Async();
-- thread:run(function()
--   form.onsubmit = simulatedDelayedCallback(5000, function()
--     -- if not flure_code.value then return false end
--     vm.build_mode = true
--     drawer.init()
--     print("------ run_code -------")
--     -- print(coroutine.status(co))
--     window.flure_value = drawer.render(flure_code.value, "output_img")
--     -- return false
--     -- Once callback is executed, resume the thread
--     thread:resume();
--   end);

--   -- Halt the thread and wait for the callback to resume it
--   thread:halt();

--   -- Execute the rest of the code
--   print("Hello world 2");
--   return false
-- end);
