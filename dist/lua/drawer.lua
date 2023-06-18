local interpreter = require "lua.vm"
local grid = require "lua.grid"

local M = {}
local sz = 128 * 2

function M.init() grid.init_grid(sz) end

function M.render(code, file_name)

  local file = ""
  local done = false

  file = file .. ("P1\n# " .. file_name .. "\n" .. sz .. " " .. sz .. "\n")

  for y = 1, sz, 1 do
    for x = 1, sz, 1 do

      -- [EXAMPLE CODES]: try uncomment to see different results.
      -- local code = "x y ^ 5 % !"
      -- local code = "x y + abs x y - abs 1 + ^ 2 << 5 % !"
      -- local code = "x 2 * y % !"
      -- local code = "x 128 - 64 * y 128 - % !"
      -- local code = "x y ^ 7 % !"
      local opt = {}
      opt["x"] = x
      opt["y"] = y

      local val = interpreter.EXEC(code, opt)
      file = file .. val .. " "
      file = file .. (x == sz and "\n" or "")
    end
  end

  print("from render function")
  print(file)
  return file
end

return M
