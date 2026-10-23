$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$outputDirectory = Join-Path $projectRoot 'outputs'
$stageDirectory = Join-Path $outputDirectory ('package-' + [guid]::NewGuid().ToString('N'))
$archivePath = Join-Path $outputDirectory 'Humanly-JOVI-Sprint4.zip'
$files = @('app', 'public', 'scripts', 'tests', 'package.json', 'package-lock.json', 'tsconfig.json', 'next-env.d.ts', 'next.config.ts', 'postcss.config.mjs', 'eslint.config.mjs', '.gitignore', '.env.example', 'README.md', 'INTEGRANTES.TXT')
New-Item -ItemType Directory -Path $stageDirectory -Force | Out-Null
foreach ($entry in $files) {
  Copy-Item -LiteralPath (Join-Path $projectRoot $entry) -Destination $stageDirectory -Recurse
}
Add-Type -AssemblyName System.IO.Compression.FileSystem
# O ZIP anterior é substituído apenas dentro da pasta outputs deste projeto.
if (Test-Path -LiteralPath $archivePath) { Remove-Item -LiteralPath $archivePath -Force }
[IO.Compression.ZipFile]::CreateFromDirectory($stageDirectory, $archivePath)
$zip = [IO.Compression.ZipFile]::OpenRead($archivePath)
try {
  foreach ($required in @('README.md', 'INTEGRANTES.TXT', 'package-lock.json', '.env.example', 'app/page.tsx')) {
    if (-not ($zip.Entries | Where-Object { $_.FullName.Replace('\', '/') -eq $required })) { throw "Arquivo obrigatório ausente: $required" }
  }
  if ($zip.Entries | Where-Object { $_.FullName -match '(^|[/\\])(node_modules|\.git|\.next|\.vercel|\.env\.local)([/\\]|$)' }) { throw 'O ZIP contém arquivos indevidos.' }
  Write-Output "ZIP verificado: $archivePath ($($zip.Entries.Count) arquivos)"
} finally { $zip.Dispose() }
$resolvedStage = [IO.Path]::GetFullPath($stageDirectory)
$resolvedOutput = [IO.Path]::GetFullPath($outputDirectory) + [IO.Path]::DirectorySeparatorChar
if (-not $resolvedStage.StartsWith($resolvedOutput, [StringComparison]::OrdinalIgnoreCase)) { throw 'Pasta temporária fora de outputs.' }
Remove-Item -LiteralPath $resolvedStage -Recurse -Force
