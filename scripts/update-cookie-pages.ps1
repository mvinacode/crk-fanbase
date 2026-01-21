# Script pour mettre à jour toutes les pages de cookies
# 1. Ajouter buttons.css dans le head
# 2. Ajouter des <span> aux boutons de navigation
# 3. Supprimer les styles de boutons des fichiers CSS individuels

$pagesPath = "c:\Users\bibic\Desktop\Mes dossiers\crk-site-main\pages"
$cssPath = "c:\Users\bibic\Desktop\Mes dossiers\crk-site-main\assets\css"

Write-Host "Mise à jour des pages HTML..."

# Obtenir tous les fichiers HTML de cookies (qui commencent par cookie_)
$htmlFiles = Get-ChildItem -Path $pagesPath -Filter "cookie_*.html"

foreach ($file in $htmlFiles) {
    Write-Host "Traitement de $($file.Name)..."
    
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # 1. Ajouter buttons.css si pas déjà présent
    if ($content -notmatch 'buttons\.css') {
        $content = $content -replace '(<link\s+rel="icon"[^>]+>)', '$1`n    <link rel="stylesheet" href="../assets/css/buttons.css">'
    }
    
    # 2. Ajouter <span> aux boutons précédent/suivant si pas déjà présent
    if ($content -match 'class="btn-cookie-precedent"[^>]*>([^<]+)</a>' -and $content -notmatch 'class="btn-cookie-precedent"[^>]*><span>') {
        $content = $content -replace 'class="btn-cookie-precedent"([^>]*)>([^<]+)</a>', 'class="btn-cookie-precedent"$1><span>$2</span></a>'
    }
    
    if ($content -match 'class="btn-cookie-suivant"[^>]*>([^<]+)</a>' -and $content -notmatch 'class="btn-cookie-suivant"[^>]*><span>') {
        $content = $content -replace 'class="btn-cookie-suivant"([^>]*)>([^<]+)</a>', 'class="btn-cookie-suivant"$1><span>$2</span></a>'
    }
    
    # Sauvegarder le fichier
    $content | Set-Content -Path $file.FullName -Encoding UTF8 -NoNewline
}

Write-Host "`nMise à jour des fichiers CSS..."

# Obtenir tous les fichiers CSS de cookies
$cssFiles = Get-ChildItem -Path $cssPath -Filter "cookie_*.css"

foreach ($file in $cssFiles) {
    Write-Host "Traitement de $($file.Name)..."
    
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Supprimer les styles de boutons .btn-cookie-precedent et .btn-cookie-suivant
    $pattern = '\.btn-cookie-(precedent|suivant)\s*\{[^}]+\}\s*(\.btn-cookie-(precedent|suivant):hover\s*\{[^}]+\}\s*)*'
    
    if ($content -match $pattern) {
        $content = $content -replace $pattern, "`n/* Les styles de boutons sont maintenant dans buttons.css */`n"
        
        # Sauvegarder le fichier
        $content | Set-Content -Path $file.FullName -Encoding UTF8 -NoNewline
    }
}

Write-Host "Terminé ! Toutes les pages de cookies ont été mises à jour."
Write-Host "Total de fichiers HTML traités: $($htmlFiles.Count)"
Write-Host "Total de fichiers CSS traités: $($cssFiles.Count)"
