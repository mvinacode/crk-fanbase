$cssDir = "c:\Users\bibic\Desktop\Mes dossiers\crk-site-main\assets\css"
$cssFiles = Get-ChildItem -Path $cssDir -Filter "cookie_*.css"

Write-Host "Nettoyage de" $cssFiles.Count "fichiers CSS..."

foreach ($file in $cssFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Supprimer .btn { }
    $content = $content -replace '(?s)\.btn\s*\{[^}]*\}', ''
    
    # Supprimer .btn:hover { }
    $content = $content -replace '(?s)\.btn:hover\s*\{[^}]*\}', ''
    
    # Supprimer .btn-save:hover { }
    $content = $content -replace '(?s)\.btn-save:hover\s*\{[^}]*\}', ''
    
    # Supprimer les multiples sauts de ligne
    $content = $content -replace '(\r?\n){3,}', "`r`n`r`n"
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    Write-Host "Nettoye:" $file.Name -ForegroundColor Green
}

Write-Host "Termine!" $cssFiles.Count "fichiers CSS nettoyes." -ForegroundColor Cyan
