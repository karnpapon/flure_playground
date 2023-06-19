local js = require "js"
local vm = require "lua.vm"
local drawer = require "lua.drawer"

-- Save references to lua baselib functions used
local _G = _G
-- local load = load
local pack, unpack, tinsert, tremove = table.pack, table.unpack, table.insert, table.remove
local tostring = tostring
-- local traceback = debug.traceback
-- local xpcall = xpcall

local window = js.global
local document = js.global.document

local output = document:getElementById("flure-console")
local prompt = document:getElementById("flure-prompt")
local input = document:getElementById("flure-input")
assert(output and prompt and input)

local function triggerEvent(el, type)
    local e = document:createEvent("HTMLEvents")
    e:initEvent(type, false, true)
    el:dispatchEvent(e)
end

local history = {}
local historyIndex = nil
local historyLimit = 100

_G.print = function(...)
    local toprint = pack(...)

    local line = document:createElement("pre")
    line.style["white-space"] = "pre-wrap"
    output:appendChild(line)

    for i = 1, toprint.n do
        if i ~= 1 then
            line:appendChild(document:createTextNode("\t"))
        end
        line:appendChild(document:createTextNode(tostring(toprint[i])))
    end

    output.scrollTop = output.scrollHeight
end

local function run_flure_repl(line)
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

local function doComputeImage()
  print("computing a (1-bit) binary graphic image...")
  if input.value.length == 0 then
    print("empty input value")
    return
  end

  local line = input.value
  if history[#history] ~= line then
      tinsert(history, line)
      if #history > historyLimit then
          tremove(history, 1)
      end
  end
  vm.build_mode = true
  drawer.init()
  window:setTimeout(function() drawer.render(line, "output_img")  end, 200)
end

local function doREPL()
    do
        local line = document:createElement("span")
        line:appendChild(document:createTextNode(prompt.textContent))
        local item = document:createElement("pre")
        item.className = "lua"
        item.style.padding = "0"
        item.style.display = "inline"
        item.style["white-space"] = "pre-wrap"
        item.textContent = input.value
        line:appendChild(item)
        output:appendChild(line)
        output:appendChild(document:createElement("br"))
        output.scrollTop = output.scrollHeight
    end

    if input.value.length == 0 then
        return
    end

    local line = input.value
    if history[#history] ~= line then
        tinsert(history, line)
        if #history > historyLimit then
            tremove(history, 1)
        end
    end

    local res = run_flure_repl(line)

    _G.print(res)

    input.value = ""

    triggerEvent(output, "change")
end

function input:onkeydown(e)
    if not e then
        e = js.global.event
    end

    local key = e.key or e.which
    if key == "Enter" and not e.shiftKey then
        historyIndex = nil
        doREPL()
        return false
    elseif key == "Enter" and e.shiftKey then
        historyIndex = nil
        local loading_elem = document:getElementById("canvas_loading")
        loading_elem.style.display = "flex"
        loading_elem.style.flexDirection = "column"
        doComputeImage()
        return false
    elseif key == "ArrowUp" or key == "Up" then
        if historyIndex then
            if historyIndex > 1 then
                historyIndex = historyIndex - 1
            end
        else -- start with more recent history item
            local hist_len = #history
            if hist_len > 0 then
                historyIndex = hist_len
            end
        end
        input.value = history[historyIndex]
        return false
    elseif key == "ArrowDown" or key == "Down" then
        local newvalue = ""
        if historyIndex then
            if historyIndex < #history then
                historyIndex = historyIndex + 1
                newvalue = history[historyIndex]
            else -- no longer in history
                historyIndex = nil
            end
        end
        input.value = newvalue
        return false
    elseif key == "l"
        and e.ctrlKey
        and not e.shiftKey
        and not e.altKey
        and not e.metaKey
        and not e.isComposing then
        -- Ctrl+L clears screen like you would expect in a terminal
        output.innerHTML = ""
        _G.print("[ArrowUp/ArrowDown]: get previous terminal history\n[Ctrl+L]: to clear a console\n[Enter]: run REPL\n[ShiftEnter]: compute an 1-bit graphic image.\n\n")
        return false
    end
end

_G.print("[ArrowUp/ArrowDown]: get previous terminal history\n[Ctrl+L]: to clear a console\n[Enter]: run REPL\n[ShiftEnter]: compute an 1-bit graphic image.\n\n")